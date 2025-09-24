"use server";

import Stripe from "stripe";
import { CartItem } from "../store";
import { urlFor } from "@/sanity/lib/image";
import { Address } from "../sanity.types";
import stripe from "@/lib/stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
}

export interface GroupedCartItems {
  product: NonNullable<CartItem["product"]>;
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Check if customer already exists in Stripe
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers?.data?.[0]?.id;

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId ?? "",
        addressId: metadata.address?._id ?? "",
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: { enabled: true },
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: process.env.NEXT_PUBLIC_CURRENCY || "KES",
          unit_amount: Math.round((item?.product?.price ?? 0) * 100),
          product_data: {
            name: item?.product?.name || "Unknown Product",
            description: item?.product?.description || "",
            metadata: { id: item?.product?._id },
            images: item?.product?.images?.length
              ? [urlFor(item?.product?.images[0]).url()]
              : ["https://placehold.co/600x400?text=No+Image"],
          },
        },
        quantity: item?.quantity,
      })),
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error: unknown) {
    interface StripeError {
      type?: string;
      message?: string;
      code?: string;
      raw?: unknown;
    }

    if (typeof error === "object" && error !== null) {
      const stripeError = error as StripeError;
      console.error("Stripe Checkout Session Error:", {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        raw: stripeError.raw,
      });
    } else {
      console.error("Stripe Checkout Session Error:", error);
    }
    throw new Error("Unable to create checkout session");
  }
}
