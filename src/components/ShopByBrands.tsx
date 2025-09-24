import Link from "next/link";
import { Title } from "./ui/text";
import { getAllBrands } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

const extraData = [
  {
    title: "Free Delivery",
    description: "Free shipping over $100",
    icon: <Truck className="h-10 w-10" />,
  },
  {
    title: "Free Return",
    description: "Free shipping over $100",
    icon: <GitCompareArrows className="h-10 w-10" />,
  },
  {
    title: "Customer Support",
    description: "Friendly 24/7 customer support",
    icon: <Headset className="h-10 w-10" />,
  },
  {
    title: "Money Back Guarantee",
    description: "Quality checked by our team",
    icon: <ShieldCheck className="h-10 w-10" />,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  return (
    <section className="mb-16 lg:mb-24">
      {/* Brands Section */}
      <div className="bg-kitenge-red/5 rounded-2xl p-6 lg:p-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <Title className="text-2xl lg:text-3xl">Shop By Brands</Title>
          <Link
            href="/shop"
            className="text-sm font-semibold text-kitenge-red hover:text-kitenge-red/80 transition-colors duration-300 flex items-center group"
          >
            View all
            <svg
              className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={{ pathname: "/shop", query: {brand: brand?.slug?.current}}} 
              className="group bg-white rounded-xl p-4 flex items-center justify-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {brand?.image && (
                <Image
                  src={urlFor(brand.image).url()}
                  alt="brandImage"
                  width={120}
                  height={80}
                  className="w-24 h-16 object-contain grayscale-[50%] group-hover:grayscale-0 transition-all duration-500"
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {extraData.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100"
          >
            <div className="flex-shrink-0 p-3 text-kitenge-red bg-kitenge-red/10 rounded-lg group-hover:bg-kitenge-red/20 transition-colors duration-300">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1.5 text-lg">
                {item.title}
              </h3>
              <p className="text-gray-z600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrands;
