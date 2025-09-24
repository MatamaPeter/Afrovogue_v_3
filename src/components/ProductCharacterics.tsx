import { getBrand } from "@/sanity/queries";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Product } from "../../sanity.types";

const ProductCharacteristics = async ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  const brand = await getBrand(product?.slug?.current as string);

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="flex w-full items-center justify-between px-6 py-4 text-left font-medium transition-all hover:bg-gray-50/50 data-[state=open]:bg-gray-50/30 group">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-kitenge-red rounded-full flex-shrink-0"></div>
              <span className="font-semibold text-gray-900 tracking-tight group-hover:text-kitenge-red transition-colors">
                Product Specifications
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down px-6 pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">Brand</span>
                {brand && (
                  <span className="font-semibold text-kitenge-red bg-kitenge-red/10 px-3 py-1 rounded-full text-sm">
                    {brand[0]?.brandName}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">
                  Collection
                </span>
                <span className="font-semibold text-gray-900 bg-blue-100/50 px-3 py-1 rounded-full text-sm">
                  2025
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">Type</span>
                <span className="font-semibold text-gray-900 bg-green-100/50 px-3 py-1 rounded-full text-sm">
                  {product?.variant}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-600">
                  Availability
                </span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product?.stock
                      ? "text-green-800 bg-green-100/60"
                      : "text-red-800 bg-red-100/60"
                  }`}
                >
                  {product?.stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductCharacteristics;
