import { cn } from "@/lib/utils";
import { Product } from "../../sanity.types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import useStore from "../../store";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface Props {
  product: Product;
  className?: string;
  variant?: "default" | "compact" | "inline";
  showAddToCart?: boolean;
}

const QuantityButtons = ({
  product,
  className,
  variant = "default",
  showAddToCart = false,
}: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;
  const isAtMaxQuantity = itemCount >= (product?.stock as number);

  const handleRemoveProduct = () => {
    removeItem(product?._id);
    if (itemCount > 1) {
      toast.success("Quantity decreased", {
        icon: "➖",
        style: {
          background: "#f0f9ff",
          color: "#0369a1",
          border: "1px solid #bae6fd",
        },
      });
    } else {
      toast.success(`${product?.name?.substring(0, 20)} removed`, {
        icon: "🗑️",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      });
    }
  };

  const handleAddToCart = () => {
    if (!isAtMaxQuantity) {
      addItem(product);
      toast.success("Added to cart", {
        icon: "🛒",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #bbf7d0",
        },
      });
    } else {
      toast.error("Maximum quantity reached", {
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      });
    }
  };

  const handleQuickAdd = () => {
    if (itemCount === 0 && !isOutOfStock) {
      addItem(product);
      toast.success("Added to cart", {
        icon: "🎉",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #bbf7d0",
        },
      });
    }
  };

  // Compact variant for tight spaces
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button
          onClick={handleRemoveProduct}
          variant="ghost"
          size="icon"
          disabled={itemCount === 0 || isOutOfStock}
          className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </Button>

        <span
          className={cn(
            "font-semibold text-sm min-w-[24px] text-center px-1 py-0.5 rounded-md",
            itemCount > 0 ? "bg-blue-50 text-blue-600" : "text-gray-400"
          )}
        >
          {itemCount}
        </span>

        <Button
          onClick={handleAddToCart}
          variant="ghost"
          size="icon"
          disabled={isOutOfStock || isAtMaxQuantity}
          className={cn(
            "w-7 h-7 rounded-lg transition-all",
            isAtMaxQuantity
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-green-50 hover:text-green-600"
          )}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  // Inline variant for product lists
  if (variant === "inline") {
    if (itemCount === 0 && !showAddToCart) {
      return (
        <Button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={cn(
            "h-8 px-3 rounded-full text-xs font-medium transition-all",
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-kitenge-red hover:bg-kitenge-red/90 text-white shadow-sm hover:shadow-md"
          )}
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Add to Cart
        </Button>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-gray-50 rounded-full px-1 py-1",
          className
        )}
      >
        <Button
          onClick={handleRemoveProduct}
          variant="ghost"
          size="icon"
          disabled={itemCount === 0 || isOutOfStock}
          className="w-6 h-6 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </Button>

        <span className="font-semibold text-sm min-w-[20px] text-center text-gray-700">
          {itemCount}
        </span>

        <Button
          onClick={handleAddToCart}
          variant="ghost"
          size="icon"
          disabled={isOutOfStock || isAtMaxQuantity}
          className={cn(
            "w-6 h-6 rounded-full transition-all",
            isAtMaxQuantity
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-green-50 hover:text-green-600"
          )}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {itemCount === 0 && showAddToCart ? (
        <Button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={cn(
            "h-10 px-6 rounded-xl font-medium transition-all duration-300 relative overflow-hidden",
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-kitenge-red to-kitenge-red/90 hover:from-kitenge-red/90 hover:to-kitenge-red text-white shadow-lg hover:shadow-xl hover:scale-105"
          )}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </Button>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                isAtMaxQuantity
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              )}
            >
              {isAtMaxQuantity ? "Max reached" : `${product?.stock} available`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRemoveProduct}
              variant="outline"
              size="icon"
              disabled={itemCount === 0 || isOutOfStock}
              className={cn(
                "w-7 h-7 rounded-md border-2 transition-all duration-200",
                itemCount === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:scale-105"
              )}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex-1 text-center">
              <span className=" font-bold text-gray-900 block">
                {itemCount}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="icon"
              disabled={isOutOfStock || isAtMaxQuantity}
              className={cn(
                "w-7 h-7 rounded-md border-2 transition-all duration-200",
                isAtMaxQuantity
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-green-200 text-green-600 hover:border-green-300 hover:bg-green-50 hover:scale-105"
              )}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {itemCount > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="font-semibold text-kitenge-red">
                KES {((product?.price || 0) * itemCount).toLocaleString()}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuantityButtons;
