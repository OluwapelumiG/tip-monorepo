import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { paymentService } from "../services/payment";
import prisma from "@illtip/db";

export const paymentRouter = {
  getPlans: publicProcedure.handler(async () => {
    return await prisma.paymentPlan.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
  }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .handler(async ({ input, context }) => {
      const { planId, successUrl, cancelUrl } = input;
      const { user } = context.session;

      const plan = await prisma.paymentPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new Error("Plan not found");
      }

      const options = {
        planId,
        userId: user.id,
        email: user.email,
        amount: plan.price,
        currency: plan.currency as "USD" | "NGN",
        successUrl,
        cancelUrl,
      };

      let result;
      if (plan.currency === "USD") {
        result = await paymentService.createStripeSession(options);
      } else {
        result = await paymentService.createPaystackSession(options);
      }

      // Record the intent
      await prisma.paymentIntent.create({
        data: {
          userId: user.id,
          planId: plan.id,
          externalId: result.id,
          provider: plan.currency === "USD" ? "stripe" : "paystack",
          amount: plan.price,
          currency: plan.currency,
          status: "pending",
        },
      });

      return result;
    }),
};
