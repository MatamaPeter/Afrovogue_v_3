// src/app/api/mpesa/stk/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAccessToken,
  getPassword,
  MPESA_BASE,
  normalizePhone,
} from "@/lib/mpesa";
import { backendClient } from "@/sanity/lib/backendClient"; // adjust import if path differs

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, phone, orderNumber } = body;

    if (!amount || !phone || !orderNumber) {
      return NextResponse.json(
        { error: "amount, phone and orderNumber required" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const { password, timestamp } = getPassword();
    const normalized = normalizePhone(phone);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: normalized,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: normalized,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderNumber,
      TransactionDesc: `Order ${orderNumber}`,
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

    // Persist request to Sanity so callback can map it later
    // Document type: mpesaRequest (create this in your Sanity schema or use orderType)
    try {
      await backendClient.create({
        _type: "mpesaRequest",
        orderNumber,
        amount: Number(amount),
        phone: normalized,
        merchantRequestId: data.MerchantRequestID || null,
        checkoutRequestId: data.CheckoutRequestID || null,
        response: data,
        status: data.ResponseCode === "0" ? "PENDING" : "FAILED",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Failed to persist mpesa request to Sanity:", err);
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("STK initiation error:", err);
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
