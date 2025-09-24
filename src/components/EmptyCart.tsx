"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* Floating Icon */}
      <div className="relative mb-6">
        <div className=" text-kitenge-red p-6 animate-pulse">
          <ShoppingCart className="w-12 h-12" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
        Your cart feels a little empty 
      </h2>

      {/* Message */}
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        Looks like you haven’t added anything yet. Don’t worry, our collection
        is waiting for you — start exploring and fill your cart with
        African-inspired fashion pieces you’ll love.
      </p>

      {/* CTA */}
      <div className="flex gap-4">
        <Link href="/shop">
          <Button className="bg-kitenge-red hover:bg-kitenge-gold text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
            Browse Collection
          </Button>
        </Link>

        <Link href="/">
          <Button
            variant="outline"
            className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
