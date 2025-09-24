"use client";
import React, { useState, useEffect } from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_2, banner_3, banner_4 } from "../../images";

const HomeBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="relative overflow-hidden font-sans">
      {/* Geometric pattern overlay with subtle animation */}
      <div className="absolute inset-0 opacity-[0.03] animate-float">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0zMCAxYXY1OCBNMTUgMTVoMzBNMTUgNDVoMzBNNDUgMTVoMzBNNDUgNDVoMzBNMSAzMGg1OCBNMTUgMTV2MzBNNDUgMTV2MzAiLz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="flex flex-col lg:flex-row w-full h-full gap-4 lg:gap-5 relative">
        {/* Left Card - Completely redesigned for mobile */}
        {isMobile ? (
          <div className="w-full bg-gradient-to-br from-kitenge-red to-kitenge-red/90 text-white rounded-3xl p-6 shadow-xl overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5"></div>

            <div className="relative z-10">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/20">
                  New Collection
                </span>
              </div>

              <Title className="text-3xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                Modern African Attire
              </Title>

              <p className="text-white/90 mb-6 text-base font-light leading-relaxed max-w-md">
                Discover our exclusive collection of premium African clothing
                that celebrates rich cultural heritage with contemporary style.
              </p>

              <div className="mt-6">
                <Link
                  href={"/shop"}
                  className="inline-flex items-center bg-white text-kitenge-red px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group/btn"
                >
                  Shop Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Floating African pattern elements */}
            <div className="absolute bottom-4 right-4 opacity-20">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 10C40 10 50 20 50 30C50 40 30 40 30 30C30 20 40 10 40 10Z"
                  fill="white"
                />
                <path
                  d="M20 30C20 30 30 20 40 20C50 20 60 30 60 40C60 50 50 60 40 60C30 60 20 50 20 40C20 30 20 30 20 30Z"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div className="relative w-full lg:w-7/10 h-80 lg:h-[32rem] overflow-hidden rounded-3xl group">
            <Image
              src={banner_4}
              alt="African fashion model"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300">
                  New Collection
                </span>
              </div>
              <Title className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 tracking-tight">
                <span className="font-light">Modern</span> <br />
                African Attire
              </Title>

              <p className="text-white/90 max-w-md mb-6 text-lg font-light leading-relaxed">
                Discover our exclusive collection of premium African clothing
                that celebrates rich cultural heritage with contemporary style.
              </p>
              <div className="mt-4">
                <Link
                  href={"/shop"}
                  className="inline-flex items-center bg-white text-gray-800 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group/btn"
                >
                  Shop Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Right Cards (Stacked vertically on mobile) */}
        <div className="flex flex-col w-full lg:w-3/10 gap-4">
          {/* Top Right Card */}
          <div className="relative h-60 lg:h-7/10 overflow-hidden rounded-3xl group">
            <Image
              src={banner_3}
              alt="African print fabric"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              width={500}
              height={400}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 rounded-3xl">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 tracking-tight">
                New Collections
              </h3>
              <p className="text-sm text-gray-200 max-w-md leading-relaxed font-light mb-4">
                Discover the most elegant African attires, blending tradition
                with modern style.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center text-white text-sm font-medium hover:underline transition-all duration-300 group/link"
              >
                Explore Collection
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom Right Card */}
          <div className="h-24 lg:h-3/10 bg-gradient-to-r from-kitenge-red to-kitenge-red/90 text-white rounded-3xl flex items-center justify-between p-6 shadow-lg relative overflow-hidden group">
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Hot Deals</h3>
              <p className="text-sm opacity-90 font-light hidden lg:block">
                Limited time offers
              </p>
            </div>
            <Link
              href={"/deals"}
              className="bg-white text-kitenge-red w-12 h-12 rounded-full flex items-center justify-center font-medium hover:bg-gray-100 transition-all duration-300 relative z-10 shadow-md hover:shadow-lg hover:scale-105"
              aria-label="View hot deals"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeBanner;
