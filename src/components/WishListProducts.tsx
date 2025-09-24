"use client";

import { useState } from "react";
import useStore from "../../store";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import PriceFormatter from "./PriceFormatter";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import toast from "react-hot-toast";
import { Product } from "../../sanity.types";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your wishlist?"
    );
    if (confirmReset) {
      resetFavorite();
      toast.success("Wishlist reset successfully!");
    }
  };

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          {/* Wishlist Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-600">
                  <th className="p-3">Image</th>
                  <th className="p-3 hidden md:table-cell">Category</th>
                  <th className="p-3 hidden md:table-cell">Type</th>
                  <th className="p-3 hidden md:table-cell">Status</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-center md:text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  ?.map((product: Product, idx) => (
                    <tr
                      key={product?._id}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-3 py-4 flex items-center gap-3">
                        <X
                          onClick={() => {
                            removeFromFavorite(product?._id);
                            toast.success("Product removed from wishlist!");
                          }}
                          size={18}
                          className="text-gray-400 hover:text-red-600 hover:scale-110 cursor-pointer transition-transform"
                        />
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="border rounded-md group hidden md:inline-flex overflow-hidden"
                          >
                            <Image
                              src={urlFor(product?.images[0]).url()}
                              alt="product image"
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 transition-transform h-20 w-20 object-contain"
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1 font-medium text-gray-900">
                          {product?.name}
                        </p>
                      </td>

                      <td className="p-3 capitalize hidden md:table-cell text-sm text-gray-600">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product.categories.join(", ")}
                          </p>
                        )}
                      </td>

                      <td className="p-3 capitalize hidden md:table-cell text-sm text-gray-600">
                        {product?.variant}
                      </td>

                      <td
                        className={`p-3 hidden md:table-cell text-sm font-medium ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(product?.stock as number) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </td>

                      <td className="p-3 font-semibold text-gray-900">
                        <PriceFormatter amount={product?.price} />
                      </td>

                      <td className="p-3">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Load More / Less Controls */}
          <div className="flex items-center gap-3 my-6">
            {visibleProducts < favoriteProduct?.length && (
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            )}
            {visibleProducts > 10 && (
              <Button onClick={() => setVisibleProducts(10)} variant="outline">
                Load Less
              </Button>
            )}
          </div>

          {/* Reset Wishlist Button */}
          {favoriteProduct?.length > 0 && (
            <Button
              onClick={handleResetWishlist}
              className="mb-8 font-semibold"
              variant="destructive"
              size="lg"
            >
              Reset Wishlist
            </Button>
          )}
        </>
      ) : (
        /* Empty Wishlist State */
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-kitenge-red" />
            <Heart className="h-14 w-14 text-kitenge-red" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-gray-600">
              Start exploring and save items you love for later!
            </p>
          </div>
          <Button className="bg-kitenge-red hover:bg-kitenge-red/90" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
