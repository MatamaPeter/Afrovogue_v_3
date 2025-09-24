import { cn } from "@/lib/utils";
import { Heart } from "lucide-react"
import { Product } from "../../sanity.types";
import useStore from "../../store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddToWishlistButton = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);
  const handleFavourite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!",
          {
            style: {
              background: existingProduct ? "#fef2f2" : "#f0fdf4", 
              color: existingProduct ? "#dc2626" : "#16a34a", 
              border: existingProduct
                ? "1px solid #fecaca"
                : "1px solid #bbf7d0",
              padding: "10px 14px",
              borderRadius: "8px",
              fontWeight: 500,
            },
          }
        );

      });
    }
  };
  return (
    <div className={cn("absolute top-2 right-2 cursor-pointer", className)}>
      <button
        onClick={handleFavourite}
        className={`p-2.5 rounded-full hover:bg-kitenge-red hover:text-white hoverEffect ${existingProduct ? "bg-kitenge-red text-white" : "bg-kitenge-red/10"}`}
      >
        <Heart size={15} />
      </button>
    </div>
  );
};

export default AddToWishlistButton
