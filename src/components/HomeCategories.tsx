import Image from "next/image";
import { Category } from "../../sanity.types";
import { Title } from "./ui/text";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-white border border-kitenge-cream my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-3">Popular Categories</Title>
      <div className="mt-5  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="bg-kitenge-red/5 p-5 flex items-center gap-3 group"
          >
            {category?.image && (
              <div className="overflow-hidden border border-kitenge-cream hover:border-kitenge-red hoverEffect w-20 h-20 p-1">
                <Link href={`/category/${category?.slug?.current}`}>
                  <Image
                    src={urlFor(category?.image).url()}
                    alt="categoryImage"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                  />
                </Link>
              </div>
            )}
            <div className="space-y-1">
              <h3>{category?.title}</h3>
              <p className="text-sm">
                <span className="font-bold text-kitenge-red">
                  {`(${category?.productCount})`}
                </span>{" "}
                items available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
