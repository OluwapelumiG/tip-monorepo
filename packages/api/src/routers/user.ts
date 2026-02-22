import { z } from "zod";
import prisma from "@illtip/db";
import { protectedProcedure, publicProcedure } from "../index";
import { ORPCError } from "@orpc/server";

export const userRouter = {
  getUserProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .handler(async ({ input }) => {
      const [user, mediaPostsCount] = await Promise.all([
        prisma.user.findUnique({
          where: { id: input.userId },
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        }),
        prisma.post.count({
          where: { 
            userId: input.userId,
            media: { some: {} }
          }
        })
      ]);

      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          message: "User not found",
        });
      }

      return {
        ...user,
        stats: {
          posts: mediaPostsCount,
          friends: "0", // Placeholder
          reviews: "0", // Placeholder
        },
      };
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).optional(),
      image: z.string().url().optional().or(z.string().length(0)),
    }))
    .handler(async ({ input, context }) => {
      const user = await prisma.user.update({
        where: { id: context.user.id },
        data: {
          name: input.name,
          image: input.image === "" ? null : input.image,
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      return user;
    }),
};
