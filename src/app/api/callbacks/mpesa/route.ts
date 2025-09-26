// src/app/api/callbacks/mpesa/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient"; // adjust import

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) {
      console.warn("Callback missing stkCallback payload", body);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const merchantRequestId = stkCallback.MerchantRequestID;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Extract metadata items (receipt, amount, phone)
    let mpesaReceipt = "";
    let amount = 0;
    let phone = "";

    const items = stkCallback?.CallbackMetadata?.Item || [];
    for (const it of items) {
      if (it.Name === "MpesaReceiptNumber")
        mpesaReceipt = String(it.Value || "");
      if (it.Name === "Amount") amount = Number(it.Value || 0);
      if (it.Name === "PhoneNumber") phone = String(it.Value || "");
    }

    // Update mpesaRequest document in Sanity by checkoutRequestId or merchantRequestId
    try {
      // Try update by checkoutRequestId first
      const query = `*[_type == "mpesaRequest" && (checkoutRequestId == $id || merchantRequestId == $id)][0]`;
      const record = await backendClient.fetch(query, {
        id: checkoutRequestId || merchantRequestId,
      });

      if (record?._id) {
        await backendClient
          .patch(record._id)
          .set({
            resultCode,
            resultDesc,
            mpesaReceipt,
            amount,
            phone,
            raw: stkCallback,
            status: resultCode === 0 ? "SUCCESS" : "FAILED",
            updatedAt: new Date().toISOString(),
          })
          .commit();
      } else {
        // fallback: create a record if not found
        await backendClient.create({
          _type: "mpesaRequest",
          merchantRequestId,
          checkoutRequestId,
          resultCode,
          resultDesc,
          mpesaReceipt,
          amount,
          phone,
          raw: stkCallback,
          status: resultCode === 0 ? "SUCCESS" : "FAILED",
          createdAt: new Date().toISOString(),
        });
      }

      // If payment success (ResultCode === 0) -> fulfill the order
      if (resultCode === 0) {
        // If you use an order doc in Sanity, find by orderNumber stored earlier (AccountReference)
        // Example: query for mpesaRequest to get orderNumber then set order status
        const reqRecord =
          record ||
          (await backendClient.fetch(
            `*[_type == "mpesaRequest" && checkoutRequestId == $id][0]`,
            { id: checkoutRequestId }
          ));
        if (reqRecord?.orderNumber) {
          // mark order paid in Sanity (example update; adapt to your order schema)
          const order = await backendClient.fetch(
            `*[_type == "order" && orderNumber == $orderNumber][0]`,
            { orderNumber: reqRecord.orderNumber }
          );
          if (order?._id && order?.status !== "PAID") {
            await backendClient
              .patch(order._id)
              .set({
                status: "PAID",
                paidAt: new Date().toISOString(),
                payment: {
                  method: "mpesa",
                  mpesaReceipt,
                  amount,
                  phone,
                },
              })
              .commit();
          }
        }
      }
    } catch (err) {
      console.error("Error updating mpesaRequest/order in Sanity:", err);
    }

    // Always acknowledge Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Mpesa callback error:", err);
    // Still ACK to avoid retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
