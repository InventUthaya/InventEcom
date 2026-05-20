import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid amount" });
    }

const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency: "inr",
  payment_method_types: ["card"], // ← This forces classic card UI
  // Remove or set false: automatic_payment_methods: { enabled: true }
});

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({ error: error.message });
  }
}
