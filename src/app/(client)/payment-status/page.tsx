"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, X, Loader2, Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";

interface MpesaRequest {
  _id: string;
  orderNumber: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  mpesaReceipt?: string;
  resultDesc?: string;
  amount: number;
  phone: string;
}

const PaymentStatusPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  const [mpesaRequest, setMpesaRequest] = useState<MpesaRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const fetchMpesaRequest = async () => {
    if (!orderNumber) return;

    try {
      const query = `*[_type == "mpesaRequest" && orderNumber == $orderNumber][0]`;
      const data: MpesaRequest = await client.fetch(query, { orderNumber });
      setMpesaRequest(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching M-Pesa request:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMpesaRequest();
  }, [orderNumber]);

  useEffect(() => {
    if (!mpesaRequest || mpesaRequest.status !== "PENDING") return;

    const interval = setInterval(fetchMpesaRequest, 3000); // Poll every 3 seconds

    // Timeout after 5 minutes
    const timeout = setTimeout(() => {
      setTimedOut(true);
      clearInterval(interval);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [mpesaRequest]);

  useEffect(() => {
    if (mpesaRequest?.status === "SUCCESS") {
      // Redirect to success page after 5 seconds
      const timer = setTimeout(() => {
        router.push(`/success?orderNumber=${orderNumber}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mpesaRequest, orderNumber, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-kitenge-red mx-auto mb-4" />
          <p className="text-gray-600">Checking payment status...</p>
        </motion.div>
      </div>
    );
  }

  if (!mpesaRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to find payment request.</p>
          <Link href="/cart">
            <Button>Back to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPending = mpesaRequest.status === "PENDING" && !timedOut;
  const isSuccess = mpesaRequest.status === "SUCCESS";
  const isFailed = mpesaRequest.status === "FAILED" || timedOut;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {isPending && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-kitenge-red mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h1>
            <p className="text-gray-600 mb-6">
              Please check your phone and complete the M-Pesa payment. This may take a few moments.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Smartphone className="w-4 h-4" />
              <span>Waiting for confirmation...</span>
            </div>
          </>
        )}

        {isSuccess && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">
              Your payment has been confirmed. Transaction ID: <strong>{mpesaRequest.mpesaReceipt}</strong>
            </p>
            <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
          </>
        )}

        {isFailed && (
          <>
            <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              {timedOut
                ? "Payment timed out. Please try again."
                : mpesaRequest.resultDesc || "Your payment could not be processed."}
            </p>
            <div className="space-y-3">
              <Link href="/cart">
                <Button className="w-full bg-kitenge-red hover:bg-kitenge-red/90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="w-full">
                  Back to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const PaymentStatusPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <PaymentStatusPageContent />
    </Suspense>
  );
};

export default PaymentStatusPage;
