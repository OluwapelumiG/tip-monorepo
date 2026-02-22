import { createContext } from "@illtip/api/context";
import { appRouter } from "@illtip/api/routers/index";
import { auth } from "@illtip/auth";
import { env } from "@illtip/env/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { S3Client, PutObjectCommand, PutBucketPolicyCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
// import ffmpeg from "fluent-ffmpeg";
// import { writeFile, unlink, readFile } from "node:fs/promises";
import { Readable } from "node:stream";
// import { tmpdir } from "node:os";
// import { join /*, extname */ } from "node:path";

const app = new Hono();
const SERVER_VERSION = "v3.1-ios-proxy-fix";
console.log(`[${SERVER_VERSION}] Server starting with SERVER_URL: ${env.SERVER_URL}`);

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS", "HEAD"],
    allowHeaders: ["Content-Type", "Authorization", "Range"],
    exposeHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"],
    credentials: true,
  }),
);

const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Ensure public read policy on the bucket
const setPublicPolicy = async () => {
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${env.S3_BUCKET}/*`],
      },
    ],
  };

  try {
    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: env.S3_BUCKET,
        Policy: JSON.stringify(policy),
      })
    );
    console.log(`Successfully set public policy for bucket: ${env.S3_BUCKET}`);
  } catch (err) {
    console.error("Error setting bucket policy:", err);
  }
};

setPublicPolicy();

// Media Upload Endpoint
app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"];
  const folder = (body["folder"] as string) || "uploads";

  if (!(file instanceof File)) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  const baseFileName = crypto.randomUUID();
  let processedBuffer: Buffer | Uint8Array;
  let finalFileName: string;
  let contentType: string;

  try {
    if (file.type.startsWith("image/")) {
      // Process Image with Sharp
      const inputBuffer = Buffer.from(await file.arrayBuffer());
      processedBuffer = await sharp(inputBuffer)
        .webp({ quality: 80 })
        .toBuffer();
      finalFileName = `${baseFileName}.webp`;
      contentType = "image/webp";
    } else if (file.type.startsWith("video/")) {
      // Video uploads are temporarily disabled while we fix playback issues
      return c.json({ error: "Video uploads are temporarily disabled. Please upload images only." }, 400);
      /*
      // Process Video with FFmpeg
      const inputPath = join(tmpdir(), `${baseFileName}.input${extname(file.name)}`);
      ...
      */
    } else {
      // Direct pass-through for other types
      processedBuffer = new Uint8Array(await file.arrayBuffer());
      finalFileName = `${baseFileName}-${file.name}`;
      contentType = file.type;
    }

    const key = `${folder}/${finalFileName}`;
    console.log(`Uploading to S3: bucket=${env.S3_BUCKET}, key=${key}, contentType=${contentType}`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: processedBuffer,
        ContentType: contentType,
      })
    );

    // Return the proxy URL instead of direct MinIO URL
    const url = `${env.SERVER_URL}/media/${folder}/${finalFileName}`;
    console.log(`[UPLOAD] Success! Proxy URL: ${url}`);
    return c.json({ url });

  } catch (error: any) {
    console.error("[UPLOAD] Error:", error.message);
    return c.json({ error: `Failed to process and upload media: ${error.message}` }, 500);
  }
});

// Media Proxy Route (Port 3000)
// Must handle HEAD requests as iOS AVPlayer uses them to check for byte range support
app.on(["GET", "HEAD"], "/media/:folder/:key", async (c) => {
  const folder = c.req.param("folder");
  const key = c.req.param("key");
  const s3Key = `${folder}/${key}`;
  const range = c.req.header("Range");
  const method = c.req.method;

  console.log(`[PROXY] [${method}] ${s3Key} | Range: ${range || "None"}`);

  try {
    if (method === "HEAD") {
      const command = new HeadObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: s3Key,
      });
      const response = await s3Client.send(command);
      
      c.status(200);
      c.header("Content-Type", response.ContentType || (s3Key.endsWith(".mp4") ? "video/mp4" : "application/octet-stream"));
      c.header("Content-Length", response.ContentLength?.toString() || "0");
      c.header("Accept-Ranges", "bytes");
      c.header("Cache-Control", "public, max-age=3600");
      c.header("Access-Control-Allow-Origin", "*");
      return c.body(null);
    }

    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: s3Key,
      Range: range,
    });

    const response = await s3Client.send(command);
    
    // Set response status
    c.status(range ? 206 : 200);

    // Standard headers for iOS media streaming
    c.header("Accept-Ranges", "bytes");
    c.header("Cache-Control", "public, max-age=3600");
    c.header("Access-Control-Allow-Origin", "*");
    
    if (response.ContentType) c.header("Content-Type", response.ContentType);
    if (response.ContentLength) c.header("Content-Length", response.ContentLength.toString());
    if (response.ContentRange) c.header("Content-Range", response.ContentRange);
    
    // Fallback if S3 doesn't return Content-Type
    if (!response.ContentType) {
        if (s3Key.endsWith(".mp4")) c.header("Content-Type", "video/mp4");
        else if (s3Key.endsWith(".webp")) c.header("Content-Type", "image/webp");
    }

    // Convert Node Readable to Web ReadableStream for Bun/Hono compatibility
    // This is critical for range requests in Bun
    const webStream = response.Body ? Readable.toWeb(response.Body as Readable) : undefined;
    
    return c.body(webStream as any);

  } catch (err: any) {
    if (err.name === "InvalidRange" || err.name === "RangeNotSatisfiable") {
      console.warn(`[PROXY] Invalid range requested: ${range}`);
      return c.text("Range Not Satisfiable", 416);
    }
    console.error(`[PROXY] Error for ${s3Key}:`, err.message);
    return c.json({ error: "Media not found" }, 404);
  }
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context: context,
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

app.get("/", (c) => {
  return c.text("OK");
});

export default {
  port: 3000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
