import { z } from "zod";
import prisma from "@illtip/db";
import { protectedProcedure, publicProcedure } from "../index";
import { ORPCError } from "@orpc/server";

export const postRouter = {
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        location: z.string().optional(),
        media: z.array(
          z.object({
            url: z.string().url(),
            type: z.enum(["image", "video"]),
          })
        ),
      })
    )
    .handler(async ({ input, context }) => {
      const post = await prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          userId: context.session.user.id,
          media: {
            create: input.media,
          },
        },
        include: {
          media: true,
        },
      });
      return post;
    }),

  getPosts: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        sortBy: z.enum(["trending", "explore"]).default("trending"),
      }).optional()
    )
    .handler(async ({ input, context }) => {
      const limit = input?.limit ?? 20;
      const sortBy = input?.sortBy ?? "trending";
      const cursor = input?.cursor;

      let orderBy: any = { createdAt: "desc" };

      if (sortBy === "trending") {
        orderBy = [
          { viewCount: "desc" },
          { likes: { _count: "desc" } },
          { comments: { _count: "desc" } },
          { shareCount: "desc" },
          { createdAt: "desc" },
        ];
      }

      const posts = await prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          media: true,
          likes: {
            where: {
              userId: context.session?.user.id ?? "",
            },
          },
          bookmarks: {
            where: {
              userId: context.session?.user.id ?? "",
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      const items = posts.map((post) => ({
        ...post,
        isLiked: post.likes.length > 0,
        isBookmarked: post.bookmarks.length > 0,
      }));

      return {
        items,
        nextCursor,
      };
    }),

  getUserPosts: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        type: z.enum(["all", "image", "video"]).default("all"),
      })
    )
    .handler(async ({ input, context }) => {
      const limit = input.limit ?? 20;
      const cursor = input.cursor;

      const where: any = { 
        userId: input.userId,
        media: { some: {} }
      };

      if (input.type === "image") {
        where.media = { some: { type: "image" } };
      } else if (input.type === "video") {
        where.media = { some: { type: "video" } };
      }

      const posts = await prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          media: true,
          likes: {
            where: {
              userId: context.session?.user.id ?? "",
            },
          },
          bookmarks: {
            where: {
              userId: context.session?.user.id ?? "",
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
        where,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      const items = posts.map((post) => ({
        ...post,
        isLiked: post.likes.length > 0,
        isBookmarked: post.bookmarks.length > 0,
      }));

      return {
        items,
        nextCursor,
      };
    }),

  getPostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          media: true,
          likes: {
            where: {
              userId: context.session?.user.id ?? "",
            },
          },
          bookmarks: {
            where: {
              userId: context.session?.user.id ?? "",
            },
          },
          comments: {
            where: { parentId: null },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
      });

      if (!post) {
        throw new ORPCError("NOT_FOUND");
      }

      const result = {
        ...post,
        isLiked: post.likes.length > 0,
        isBookmarked: post.bookmarks.length > 0,
      };

      // Increment view count asynchronously
      prisma.post.update({
        where: { id: input.id },
        data: { viewCount: { increment: 1 } },
      }).catch(console.error);

      return result;
    }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: userId,
          },
        },
      });

      if (existingLike) {
        await prisma.postLike.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        await prisma.postLike.create({
          data: {
            postId: input.postId,
            userId: userId,
          },
        });
        return { liked: true };
      }
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1),
        parentId: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const comment = await prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          userId: context.session.user.id,
          parentId: input.parentId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      return comment;
    }),

  toggleBookmark: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const existingBookmark = await prisma.postBookmark.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: userId,
          },
        },
      });

      if (existingBookmark) {
        await prisma.postBookmark.delete({
          where: { id: existingBookmark.id },
        });
        return { bookmarked: false };
      } else {
        await prisma.postBookmark.create({
          data: {
            postId: input.postId,
            userId: userId,
          },
        });
        return { bookmarked: true };
      }
    }),
  
  incrementShare: publicProcedure
    .input(z.object({ postId: z.string() }))
    .handler(async ({ input }) => {
      await prisma.post.update({
        where: { id: input.postId },
        data: { shareCount: { increment: 1 } },
      });
      return { success: true };
    }),
};
