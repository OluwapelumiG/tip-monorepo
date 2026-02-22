import { env } from "@illtip/env/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export interface CheckoutOptions {
  planId: string;
  userId: string;
  email: string;
  amount: number;
  currency: "USD" | "NGN";
  successUrl: string;
  cancelUrl: string;
}

export const paymentService = {
  async createStripeSession(options: CheckoutOptions) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Job Application Credits - ${options.planId}`,
            },
            unit_amount: Math.round(options.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      customer_email: options.email,
      metadata: {
        userId: options.userId,
        planId: options.planId,
      },
    });

    return { id: session.id, url: session.url };
  },

  async createPaystackSession(options: CheckoutOptions) {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: options.email,
        amount: Math.round(options.amount * 100), // Kobo
        callback_url: options.successUrl,
        metadata: {
          userId: options.userId,
          planId: options.planId,
          custom_fields: [
            {
              display_name: "Plan ID",
              variable_name: "plan_id",
              value: options.planId,
            },
          ],
        },
      }),
    });

    const data = (await response.json()) as {
      status: boolean;
      data: { authorization_url: string; access_code: string; reference: string };
    };

    if (!data.status) {
      throw new Error("Paystack initialization failed");
    }

    return { 
      id: data.data.reference, 
      url: data.data.authorization_url,
      accessCode: data.data.access_code 
    };
  },
};
