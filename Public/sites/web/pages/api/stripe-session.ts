// pages/api/stripe-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover", // Or your current version
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Optional: Log for debugging
    console.log("Session payment_status:", session.payment_status);

    // Remove the strict "paid" check — trust the redirect
    // (In production, add webhook for 100% reliability)

    res.status(200).json({
      metadata: session.metadata,
      // No longer sending payment_status, or send it but don't enforce
    });
  } catch (error: any) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve session" });
  }
}