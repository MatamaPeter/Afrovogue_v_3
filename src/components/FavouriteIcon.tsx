"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { Product } from "../../sanity.types";
import { motion } from "framer-motion";
import useStore from "../../store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FavouriteIconProps {
  showProduct?: boolean;
  product?: Product | null | undefined;
}

const FavouriteIcon = ({
  showProduct = false,
  product,
}: FavouriteIconProps) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);

  const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!product?._id) return;

    const isAlreadyFav = !!existingProduct;
    addToFavorite(product).then(() => {
      toast.success(
        isAlreadyFav
          ? "Product removed from wishlist!"
          : "Product added to wishlist!",
        {
          style: {
            background: isAlreadyFav ? "#fef2f2" : "#f0fdf4",
            color: isAlreadyFav ? "#dc2626" : "#16a34a",
            border: isAlreadyFav ? "1px solid #fecaca" : "1px solid #bbf7d0",
            padding: "10px 14px",
            borderRadius: "8px",
            fontWeight: 500,
          },
        }
      );
    });
  };

  const iconVariants = {
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  return (
    <>
      {/* Global wishlist icon (Navbar/Toolbar) */}
      {!showProduct ? (
        <Link
          href="/wishlist"
          className="group relative flex items-center justify-center p-2 rounded-full hover:bg-kitenge-cream transition-colors"
          aria-label="Go to wishlist"
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="group relative p-2 rounded-full hoverEffect hover:bg-kitenge-cream"
          >
            <Heart className="h-5 w-5 text-gray-600 group-hover:text-kitenge-red transition-colors" />
            <span className="absolute -top-1 -right-1 bg-kitenge-red text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center shadow-md ring-1 ring-white">
              {favoriteProduct?.length ?? 0}
            </span>
          </motion.div>

          <span className="absolute top-full mt-1 opacity-0 group-hover:opacity-100 text-xs bg-black text-white px-2 py-0.5 rounded-md shadow-sm transition-opacity pointer-events-none">
            Wishlist
          </span>
        </Link>
      ) : (
        // Product-level toggle button
        <motion.button
          onClick={handleFavourite}
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
          className="p-2 rounded-full bg-white hover:bg-kitenge-cream transition-colors shadow-sm"
          aria-label={
            existingProduct ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              existingProduct
                ? "text-kitenge-red fill-kitenge-red"
                : "text-gray-600 hover:text-kitenge-red"
            }`}
          />
        </motion.button>
      )}
    </>
  );
};

export default FavouriteIcon;
