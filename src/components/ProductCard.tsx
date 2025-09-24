import { urlFor } from "@/sanity/lib/image";
import { Product } from "../../sanity.types";
import Image from "next/image";
import Link from "next/link";
import { Flame, StarIcon } from "lucide-react";
import AddToWishlistButton from "./AddToWishlistButton";
import { Title } from "./ui/text";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="text-sm border-[1px] border-kitenge-cream rounded-md bg-white group">
      <div className="relative group overflow-hidden bg-white">
        {product?.images?.length ? (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt={product?.name || "Product Image"}
              loading="lazy"
              width={700}
              height={700}
              className={`w-full h-64 object-contain overflow-hidden transition-transform hoverEffect ${
                product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"
              }`}
            />
          </Link>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
            No Image
          </div>
        )}

        <AddToWishlistButton product={product} />
        {product?.status === "sale" && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-gray-400 px-2 rounded-full group-hover:border-kitenge-red group-hover:text-kitenge-red hoverEffect">
            Sale!
          </p>
        )}
        {product?.status === "new" && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-gray-400 px-2 rounded-full group-hover:border-kitenge-red group-hover:text-kitenge-red hoverEffect">
            New!
          </p>
        )}
        {product?.status === "hot" && (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-kitenge-gold/50 p-1 rounded-full group-hover:border-kitenge-gold hover:text-kitenge-red"
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-kitenge-gold/50 group-hover:text-kitenge-gold hoverEffect"
            />
          </Link>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs text-gray-400">
            {product?.categories?.map((cat) => cat).join(", ")}
          </p>
        )}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className={index < 4 ? "text-kitenge-gold" : "text-gray-400"}
                fill={index < 4 ? "#E6B808" : "#ababab"}
              />
            ))}
          </div>
          <p className="text-gray-400 text-xs tracking-wide">5 Review</p>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0 ? "text-red-600" : "text-green-500 font-semibold "}`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        <AddToCartButton product={product} className="w-36 rounded-full" />
      </div>
    </div>
  );
};

export default ProductCard;
