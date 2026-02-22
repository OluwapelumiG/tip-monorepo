import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
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
      
      if (user.role !== "employer" && user.role !== "admin") {
        throw new Error("Only employers can post jobs");
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
      })
    )
    .handler(async ({ input }) => {
      return await prisma.job.findMany({
        where: { status: input.status },
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

      if (user.role !== "worker" && user.role !== "admin") {
        throw new Error("Only workers can apply for jobs");
      }

      // Check credits
      const balance = await prisma.creditBalance.findUnique({
        where: { userId: user.id },
      });

      if (!balance || balance.credits <= 0) {
        throw new Error("Insufficient credits. Please subscribe or purchase more application packs.");
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
          throw new Error("Insufficient credits");
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
        throw new Error("Unauthorized");
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
        throw new Error("Unauthorized");
      }

      return await prisma.job.update({
        where: { id: jobId },
        data: { status },
      });
    }),
};
