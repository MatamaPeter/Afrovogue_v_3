import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavouriteIcon from "@/components/FavouriteIcon";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacterics";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

// Define the props interface for Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const SingleProductPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50/30 to-white py-8">
      <Container className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-12">
        {product.images && (
          <ImageView images={product.images} isStock={product.stock} />
        )}

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Product Header */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    size={14}
                    className="text-kitenge-gold"
                    fill="#e6b800"
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-700">(120 reviews)</p>
            </div>
          </div>

          {/* Price and Stock Status */}
          <div className="border-t border-b border-gray-200/60 py-6 space-y-4">
            <PriceView
              price={product.price}
              discount={product.discount}
              className="text-2xl font-bold text-gray-900"
            />
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                product.stock === 0
                  ? "bg-red-100/80 text-red-700"
                  : "bg-green-100/80 text-green-700"
              }`}
            >
              {(product.stock ?? 0) > 0
                ? "In Stock • Ready to ship"
                : "Out of Stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <AddToCartButton product={product} />
            <FavouriteIcon showProduct product={product} />
          </div>

          {/* Product Characteristics */}
          <ProductCharacteristics product={product} />

          {/* Utility Buttons */}
          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200/60 py-6">
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-kitenge-red transition-colors duration-200 group">
              <RxBorderSplit className="text-lg group-hover:scale-110 transition-transform" />
              <span>Compare color</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-kitenge-red transition-colors duration-200 group">
              <FaRegQuestionCircle className="text-lg group-hover:scale-110 transition-transform" />
              <span>Ask a question</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-kitenge-red transition-colors duration-200 group">
              <TbTruckDelivery className="text-lg group-hover:scale-110 transition-transform" />
              <span>Delivery & Return</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-kitenge-red transition-colors duration-200 group">
              <FiShare2 className="text-lg group-hover:scale-110 transition-transform" />
              <span>Share</span>
            </button>
          </div>

          {/* Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-4 flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-kitenge-red/10 rounded-full flex items-center justify-center">
                <Truck size={24} className="text-kitenge-red" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Free Delivery
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Within Nairobi CBD.
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-4 flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-kitenge-red/10 rounded-full flex items-center justify-center">
                <CornerDownLeft size={24} className="text-kitenge-red" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Return Delivery
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Free 30-day returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProductPage;
