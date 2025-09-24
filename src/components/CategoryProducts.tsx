"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import { Grid3X3, ChevronRight, Filter } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { Product, Category } from "../../sanity.types";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    setIsMobileMenuOpen(false);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
        ...,"categories": categories[]->title}
      `;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const currentCategory = categories.find(
    (cat) => cat.slug?.current === currentSlug
  );

  return (
    <div className="py-6  md:px-6 flex flex-col lg:flex-row items-start gap-6">
      {/* Mobile filter toggle */}
      <div className="lg:hidden w-full">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <span>Categories</span>
            {currentCategory && (
              <span className="text-kitenge-red font-medium ml-2">
                ({currentCategory.title})
              </span>
            )}
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform ${isMobileMenuOpen ? "rotate-90" : ""}`}
          />
        </Button>
      </div>

      {/* Categories sidebar: mobile (animated) */}
      <div className="w-full lg:hidden">
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-kitenge-red/5 to-kitenge-red/10">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Grid3X3 size={18} />
                Categories
              </h3>
            </div>
            <div className="p-3 space-y-1">
              {categories?.map((item) => (
                <motion.div
                  key={item?._id}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    onClick={() =>
                      handleCategoryChange(item?.slug?.current as string)
                    }
                    className={`w-full justify-between items-center bg-transparent hover:bg-kitenge-red/5 rounded-lg px-4 py-3 transition-all duration-300 ${
                      item?.slug?.current === currentSlug
                        ? "bg-kitenge-red/10 text-kitenge-red font-medium shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <span className="text-left capitalize truncate">
                      {item?.title}
                    </span>
                    {item?.slug?.current === currentSlug && (
                      <ChevronRight
                        size={16}
                        className="flex-shrink-0 text-kitenge-red"
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories sidebar: large screens (always visible) */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-kitenge-red/5 to-kitenge-red/10">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Grid3X3 size={18} />
              Categories
            </h3>
          </div>
          <div className="p-3 space-y-1">
            {categories?.map((item) => (
              <motion.div
                key={item?._id}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={() =>
                    handleCategoryChange(item?.slug?.current as string)
                  }
                  className={`w-full justify-between items-center bg-transparent hover:bg-kitenge-red/5 rounded-lg px-4 py-3 transition-all duration-300 ${
                    item?.slug?.current === currentSlug
                      ? "bg-kitenge-red/10 text-kitenge-red font-medium shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="text-left capitalize truncate">
                    {item?.title}
                  </span>
                  {item?.slug?.current === currentSlug && (
                    <ChevronRight
                      size={16}
                      className="flex-shrink-0 text-kitenge-red"
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="flex-1 min-h-96 w-full">
        {/* Active category header */}
        {currentCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {currentCategory.title}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              available
            </p>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 min-h-80 space-y-4 text-center bg-gray-50 rounded-2xl w-full"
          >
            <div className="relative">
              <div className="w-12 h-12 border-3 border-kitenge-red/20 border-t-kitenge-red rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading products...</p>
          </motion.div>
        ) : products?.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3xl:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {products?.map((product: Product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <NoProductAvailable />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
