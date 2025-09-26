"use server";

import Stripe from "stripe";
import { CartItem } from "../store";
import { urlFor } from "@/sanity/lib/image";
import { Address } from "../sanity.types";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { getAccessToken, getPassword, MPESA_BASE, normalizePhone } from "@/lib/mpesa";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
  mpesaNumber?: string;
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
    // Handle M-Pesa payment
    if (metadata.mpesaNumber) {
      return await handleMpesaCheckout(items, metadata);
    }
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

async function handleMpesaCheckout(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  // Create order in Sanity
  await createMpesaOrder(items, metadata);

  // Calculate total amount
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  // Initiate STK push
  const accessToken = await getAccessToken();
  const { password, timestamp } = getPassword();
  const normalizedPhone = normalizePhone(metadata.mpesaNumber!);

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(totalAmount),
    PartyA: normalizedPhone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: normalizedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: metadata.orderNumber,
    TransactionDesc: `Order ${metadata.orderNumber}`,
  };

  const res = await fetch(`${MPESA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  // Persist request to Sanity
  try {
    await backendClient.create({
      _type: "mpesaRequest",
      orderNumber: metadata.orderNumber,
      amount: Math.round(totalAmount),
      phone: normalizedPhone,
      merchantRequestId: data.MerchantRequestID || null,
      checkoutRequestId: data.CheckoutRequestID || null,
      response: data,
      status: data.ResponseCode === "0" ? "PENDING" : "FAILED",
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to persist mpesa request to Sanity:", err);
  }

  if (!res.ok || data.ResponseCode !== "0") {
    throw new Error("Failed to initiate M-Pesa STK push");
  }

  // Return payment status URL
  return `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?orderNumber=${metadata.orderNumber}`;
}

async function createMpesaOrder(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  const sanityProducts = items.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: item.product._id,
    },
    quantity: item.quantity,
  }));

  const address = metadata.address
    ? {
        state: metadata.address.county,
        zip: metadata.address.postalCode,
        city: metadata.address.city === "other" ? metadata.address.customCity : metadata.address.city,
        address: metadata.address.address,
        name: metadata.address.name,
      }
    : null;

  const order = await backendClient.create({
    _type: "order",
    orderNumber: metadata.orderNumber,
    clerkUserId: metadata.clerkUserId ?? "",
    customerName: metadata.customerName,
    email: metadata.customerEmail,
    currency: process.env.NEXT_PUBLIC_CURRENCY || "KES",
    amountDiscount: 0, // Assuming no discount for now
    products: sanityProducts,
    totalPrice,
    status: "pending",
    orderDate: new Date().toISOString(),
    address,
  });

  return order;
}
