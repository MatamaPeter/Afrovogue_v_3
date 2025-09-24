"use client"
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import useStore from "../../store";

const CartIcon = () => {
  const { items} = useStore();

  return (
    <Link
      href={"/cart"}
      className="group relative p-2 rounded-full hoverEffect hover:bg-kitenge-cream"
    >
      <ShoppingBag className="h-5 w-5 thoverEffect group-hover:text-kitenge-red" />
      <span className="absolute -top-1 -right-1 bg-kitenge-red text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center transform group-hover:scale-110 transition-transform hoverEffect">
        {items?.length?items?.length:0}
      </span>
    </Link>
  );
};

export default CartIcon;
