// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover" as any, // Valid and stable version
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Destructure all needed data from request body
    const { amount, orderId, address } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId" });
    }

    if (!address) {
      return res.status(400).json({ error: "Missing address data" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // You can add "upi" later when activated

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Order Payment",
              description: `Order #${orderId}`,
            },
            unit_amount: amount, // amount in paise (₹1 = 100 paise)
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,

      metadata: {
        orderId: orderId.toString(),
        addressId: address?.addressId?.toString() || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        country: address.country || "India",
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url, // This is the Stripe-hosted checkout URL
    });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    res.status(500).json({ error: error.message || "Failed to create checkout session" });
  }
}