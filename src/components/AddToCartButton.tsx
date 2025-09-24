"use client"

import { ShoppingBag } from "lucide-react";
import { Product } from "../../sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useStore from "../../store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}


const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id)


  const isOutOfStock = product?.stock === 0;
    const handleAddToCart = () => {
      if ((product?.stock as number) > itemCount){
        addItem(product);
        toast.success(
          `${product?.name?.substring(0, 2)} ...added to successfully`,
          {
            icon: "🛒",
            style: {
              background: "#f0fdf4",
              color: "#16a34a",
              border: "1px solid #bbf7d0",
            },
          }
        );
      }
    }
  return (
    <div>
      {itemCount ? (
        <div className="test-sm w-full">
          <div>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t-1 pt-1">
            <span className="text-xs font-semibold">SubTotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full text-white bg-kitenge-gold  shadow-none border border-kitenge-gold font-semibold tracking-wide hover:text-white hover:bg-kitenge-red hover:border-kitenge-red hoverEffect",
            className
          )}
        >
          <ShoppingBag />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
