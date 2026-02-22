import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { postRouter } from "./post";
import { userRouter } from "./user";
import { paymentRouter } from "./payment";
import { jobRouter } from "./job";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  post: postRouter,
  user: userRouter,
  payment: paymentRouter,
  job: jobRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
