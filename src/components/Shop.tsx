"use client";
import { useEffect, useState } from "react";
import { BRANDS_QUERYResult, Category, Product } from "../../sanity.types";
import Container from "./Container";
import BrandList from "./shop/BrandList";
import CategoryList from "./shop/CategoryList";
import { Title } from "./ui/text";
import { useSearchParams } from "next/navigation";
import PriceList from "./shop/PriceList";
import ProductCard from "./ProductCard";
import { client } from "@/sanity/lib/client";
import { Loader, X, Filter, Grid3X3, List } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }
      const query = `
        *[_type == 'product' 
          && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
          && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
          && price >= $minPrice && price <= $maxPrice
        ] 
        | order(name asc) {
          ...,"categories": categories[]->title
        }
      `;
      const data = await client.fetch(
        query,
        { selectedCategory, selectedBrand, minPrice, maxPrice },
        { next: { revalidate: 0 } }
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice]);

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    selectedPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <Title className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Discover Your Perfect Products
            </Title>
            <p className="text-gray-600">
              Curated selection tailored to your needs
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-kitenge-red text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-kitenge-red text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-kitenge-red text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== null ||
          selectedBrand !== null ||
          selectedPrice !== null) && (
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="text-sm font-medium text-gray-600">
              Active filters:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                Category:{" "}
                {
                  categories.find((c) => c.slug?.current === selectedCategory)
                    ?.title
                }
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                Brand:{" "}
                {brands.find((b) => b.slug?.current === selectedBrand)?.title}
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="hover:text-green-900"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedPrice && (
              <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                Price: ${selectedPrice}
                <button
                  onClick={() => setSelectedPrice(null)}
                  className="hover:text-purple-900"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedBrand(null);
                setSelectedPrice(null);
              }}
              className="ml-auto text-kitenge-red hover:text-kitenge-red/80 text-sm font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setSelectedPrice(null);
                    }}
                    className="text-sm text-kitenge-red hover:text-kitenge-red/80 font-medium"
                  >
                    Reset all
                  </button>
                )}
              </div>

              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <BrandList
                brands={brands}
                setSelectedBrand={setSelectedBrand}
                selectedBrand={selectedBrand}
              />

              <PriceList
                setSelectedPrice={setSelectedPrice}
                selectedPrice={selectedPrice}
              />
              
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {isFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="p-6 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setIsFiltersOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <CategoryList
                      categories={categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />

                    <BrandList
                      brands={brands}
                      setSelectedBrand={setSelectedBrand}
                      selectedBrand={selectedBrand}
                    />

                    <PriceList
                      setSelectedPrice={setSelectedPrice}
                      selectedPrice={selectedPrice}
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <button
                      onClick={() => setIsFiltersOpen(false)}
                      className="w-full bg-kitenge-red text-white py-3 rounded-lg font-medium hover:bg-kitenge-red/90 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader className="w-8 h-8 text-kitenge-red animate-spin mb-4" />
                  <p className="text-gray-600 font-medium">
                    Loading products...
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div
                  className={`
                  ${
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                `}
                >
                  {products?.map((product) => (
                    <ProductCard
                      key={product?._id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <NoProductAvailable />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
