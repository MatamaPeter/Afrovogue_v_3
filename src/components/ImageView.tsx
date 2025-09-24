"use client";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import {
  SanityImageCrop,
  SanityImageHotspot,
  internalGroqTypeReferenceTo,
} from "../../sanity.types";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const activeImage = images[activeIndex];

  return (
    <div className="w-full md:w-1/2 space-y-4">
      {/* Main Image Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage?._key}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            {activeImage && (
              <Image
                src={urlFor(activeImage).url()}
                alt="Product image"
                fill
                priority
                className={`object-contain transition-transform duration-500 ${
                  isZoomed
                    ? "scale-150 cursor-zoom-out"
                    : "hover:scale-105 cursor-zoom-in"
                } ${isStock === 0 ? "opacity-60 grayscale" : ""}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            )}

            {/* Out of stock overlay */}
            {isStock === 0 && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                  <span className="text-gray-700 font-medium text-sm">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}

            {/* Zoom indicator */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn size={18} className="text-gray-700" />
            </button>

            {/* Navigation arrows for multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <motion.button
              key={image._key}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? "border-kitenge-red shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={urlFor(image).url()}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Active indicator */}
              {index === activeIndex && (
                <div className="absolute inset-0 bg-kitenge-red/20"></div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageView;
