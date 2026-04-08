import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { ORPCError } from "@orpc/server";
import prisma from "@illtip/db";

export const jobRouter = {
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        company: z.string(),
        location: z.string().optional(),
        category: z.string().optional(),
        salaryRange: z.string().optional(),
        media: z.array(z.object({
          url: z.string(),
          type: z.string(),
        })).optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const { user } = context.session;
      const { media, ...data } = input;
      
      if (user.role !== "employer" && user.role !== "customer" && user.role !== "admin") {
        throw new ORPCError({
          code: "FORBIDDEN",
          message: "Only employers and customers can post jobs"
        });
      }

      return await prisma.job.create({
        data: {
          ...data,
          employerId: user.id,
          status: "open",
          media: {
            create: media,
          },
        },
      });
    }),

  list: publicProcedure
    .input(
      z.object({
        status: z.string().optional().default("open"),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        location: z.string().optional(),
        minPay: z.number().optional(),
        maxPay: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        categories: z.array(z.string()).optional(),
      })
    )
    .handler(async ({ input }) => {
      const limit = input.limit ?? 10;
      const cursor = input.cursor;

      const where: any = { status: input.status };
      
      if (input.location) {
        where.location = { contains: input.location, mode: "insensitive" };
      }
      
      if (input.startDate || input.endDate) {
        where.createdAt = {};
        if (input.startDate) where.createdAt.gte = new Date(input.startDate);
        if (input.endDate) where.createdAt.lte = new Date(input.endDate);
      }
      
      if (input.categories && input.categories.length > 0) {
        where.category = { in: input.categories };
      }

      const jobs = await prisma.job.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        include: {
          employer: {
            select: {
              name: true,
              image: true,
            },
          },
          media: true,
        },
        orderBy: { createdAt: "desc" },
      });

      let filteredJobs = jobs;
      
      // Filter by pay range manually since it's a string in the DB
      if (input.minPay !== undefined || input.maxPay !== undefined) {
          filteredJobs = jobs.filter(job => {
              if (!job.salaryRange) return false;
              // Extract first number found in string (e.g. "50.00", "$50", "50-100")
              const match = job.salaryRange.match(/[\d.]+/);
              if (!match) return false;
              const pay = parseFloat(match[0]);
              if (isNaN(pay)) return false;
              
              if (input.minPay !== undefined && pay < input.minPay) return false;
              if (input.maxPay !== undefined && pay > input.maxPay) return false;
              return true;
          });
      }

      let nextCursor: typeof cursor | undefined = undefined;
      // We check against the original `jobs` length for pagination logic, 
      // but pop from `filteredJobs` if it was the extra item
      if (jobs.length > limit) {
        const nextItem = jobs.pop();
        nextCursor = nextItem?.id;
        
        // Remove the extra item from filteredJobs if it's there
        if (filteredJobs[filteredJobs.length - 1]?.id === nextCursor) {
            filteredJobs.pop();
        }
      }

      return {
        items: filteredJobs,
        nextCursor,
      };
    }),

  getLocations: publicProcedure.input(z.object({}).optional()).handler(async () => {
     const jobs = await prisma.job.findMany({
         where: { location: { not: null } },
         select: { location: true },
         distinct: ['location']
     });
     
     return jobs.map(j => j.location).filter(Boolean) as string[];
  }),

  getCategories: publicProcedure.input(z.object({}).optional()).handler(async () => {
    console.log("[API] getCategories called");
    return [
      "Health & Wellness",
      "Financial Services",
      "Moving Services",
      "Tech & Digital Services",
      "Vehicle Services",
      "Beauty & Personal Care",
      "Leadership & Academic Coaching",
      "Recruitment",
      "Digital Marketing & Media",
      "Professional Services",
      "Event Planning & Entertainment",
      "Home Services & Repairs",
    ];
  }),

  getById: publicProcedure
    .input(z.string())
    .handler(async ({ input }) => {
      return await prisma.job.findUnique({
        where: { id: input },
        include: {
          employer: {
            select: {
              name: true,
              image: true,
            },
          },
          media: true,
        },
      });
    }),

  apply: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        coverLetter: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const { user } = context.session;
      const { jobId, coverLetter } = input;

      if (user.role !== "freelancer" && user.role !== "admin") {
        throw new ORPCError("FORBIDDEN", {
          message: "Only freelancers can apply for jobs"
        });
      }

      // Check credits
      const balance = await prisma.creditBalance.findUnique({
        where: { userId: user.id },
      });

      if (!balance || balance.credits <= 0) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Insufficient credits. Please subscribe or purchase more application packs."
        });
      }

      // Start transaction: Use credits and create application
      return await prisma.$transaction(async (tx) => {
        // Double check credits inside transaction
        const updatedBalance = await tx.creditBalance.update({
          where: { userId: user.id },
          data: {
            credits: { decrement: 1 },
          },
        });

        if (updatedBalance.credits < 0) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Insufficient credits"
          });
        }

        return await tx.jobApplication.create({
          data: {
            jobId,
            workerId: user.id,
            coverLetter,
            status: "pending",
          },
        });
      });
    }),

  getApplications: protectedProcedure
    .input(z.string()) // jobId
    .handler(async ({ input, context }) => {
      const { user } = context.session;
      
      const job = await prisma.job.findUnique({
        where: { id: input },
      });

      if (!job || (job.employerId !== user.id && user.role !== "admin")) {
        throw new ORPCError("UNAUTHORIZED", { message: "Unauthorized" });
      }

      return await prisma.jobApplication.findMany({
        where: { jobId: input },
        include: {
          worker: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        status: z.enum(["open", "closed", "filled"]),
      })
    )
    .handler(async ({ input, context }) => {
      const { user } = context.session;
      const { jobId, status } = input;

      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job || (job.employerId !== user.id && user.role !== "admin")) {
        throw new ORPCError("UNAUTHORIZED", { message: "Unauthorized" });
      }

      return await prisma.job.update({
        where: { id: jobId },
        data: { status },
      });
    }),
};
