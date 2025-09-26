"use client";

import useStore from "../../../../store";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Check,
  Home,
  Package,
  ShoppingBag,
  CreditCard,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import PriceFormatter from "@/components/PriceFormatter";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: SanityImageSource[];
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  status: string;
  payment?: {
    method: string;
    mpesaReceipt?: string;
    amount: number;
    phone?: string;
  };
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

const SkeletonLoader = () => (
  <div className="py-5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4 w-full">
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-48 bg-gray-200 animate-pulse rounded"></div>
    </div>
  </div>
);

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async (orderNumber: string): Promise<void> => {
    try {
      const query = `*[_type == "order" && orderNumber == $orderNumber][0] {
        _id,
        orderNumber,
        customerName,
        email,
        totalPrice,
        status,
        payment,
        products[] {
          product-> {
            _id,
            name,
            price,
            images
          },
          quantity
        },
        address
      }`;
      const data: Order = await client.fetch(query, { orderNumber });

      if (data) {
        setOrder(data);
        resetCart(); // reset cart only once after fetching order
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);



  if (loading) return <SkeletonLoader />;

  return (
    <div className="py-5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 max-w-4xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="text-white w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {order?.status === "paid" ? "Order Confirmed!" : "Payment Initiated!"}
        </h1>

        {order && (
          <div className="flex justify-center">
            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full ${
                order.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        )}

        {order ? (
          <>
            <div className="space-y-4 mb-4 text-left">
              <p className="text-gray-700">
                {order.status === "paid" ? (
                  <>
                    Thank you for your purchase. We are processing your order
                    and will ship it soon. A confirmation email with your order
                    details will be sent to your inbox shortly.
                  </>
                ) : (
                  <>
                    Your order has been placed successfully. We have initiated
                    the payment via {order.payment?.method}. Check your phone
                    for the M-Pesa STK push prompt to complete the payment.
                  </>
                )}
              </p>

              {/* Order Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border space-y-2">
                <p className="text-gray-700">
                  Order Number:{" "}
                  <span className="text-black font-semibold font-mono">
                    {order.orderNumber}
                  </span>
                </p>
                {order.payment && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>Payment Method: </span>
                    {order.payment.method === "mpesa" ? (
                      <>
                        <Smartphone className="w-4 h-4" />
                        M-Pesa{" "}
                        {order.payment.mpesaReceipt &&
                          `| Receipt: ${order.payment.mpesaReceipt}`}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Stripe
                      </>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Total: </span>
                  <span className="font-bold text-gray-900">
                    <PriceFormatter amount={order.totalPrice} />
                  </span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              <div className="space-y-3">
                {order.products.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    {item.product.images?.[0] && (
                      <Image
                        src={urlFor(item.product.images[0]).url()}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        <PriceFormatter
                          amount={item.product.price * item.quantity}
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.address && (
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-gray-700">{order.address.name}</p>
                  <p className="text-gray-700">{order.address.address}</p>
                  <p className="text-gray-700">
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zip}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4 mb-4 text-left">
            <p className="text-gray-700">
              Thank you for your purchase. We are processing your order and will
              ship it soon. A confirmation email with your order details will be
              sent to your inbox shortly.
            </p>
            <p className="text-gray-700">
              Order Number:{" "}
              <span className="text-black font-semibold font-mono">
                {orderNumber}
              </span>
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex flex-col sm:flex-row items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-0 sm:mr-2 mb-1 sm:mb-0" />
            Home
          </Link>
          <Link
            href="/orders"
            className="flex flex-col sm:flex-row items-center justify-center px-4 py-3 font-semibold bg-lightGreen text-black border border-kitenge-cream rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-0 sm:mr-2 mb-1 sm:mb-0" />
            Orders
          </Link>
          <Link
            href="/shop"
            className="flex flex-col sm:flex-row items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-0 sm:mr-2 mb-1 sm:mb-0" />
            Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
