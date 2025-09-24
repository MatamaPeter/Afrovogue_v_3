"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft,  AlertCircle } from "lucide-react";
import "./globals.css";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/50">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Animated illustration/icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative mx-auto w-48 h-48"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-kitenge-red/10 to-kitenge-red/5 rounded-3xl transform rotate-6"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-kitenge-red/20 to-kitenge-red/10 rounded-3xl transform -rotate-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <AlertCircle className="w-20 h-20 text-kitenge-red/80" />
              <div className="absolute -inset-4 bg-kitenge-red/10 rounded-full blur-lg"></div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          {/* 404 Number */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-8xl font-black text-gray-900 bg-gradient-to-r from-kitenge-red to-kitenge-red/80 bg-clip-text"
          >
            404
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800"
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might
            have been moved, deleted, or never existed.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
        >
          <Link href="/" className="flex-1">
            <Button
              className="w-full py-3 rounded-xl font-semibold bg-kitenge-red hover:bg-kitenge-red/90 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full py-3 rounded-xl font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 group"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="pt-8 border-t border-gray-200 mt-8"
        >
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-kitenge-red hover:text-kitenge-red/80 font-medium transition-colors"
            >
              Contact support
            </Link>
          </p>
        </motion.div>


      </div>
    </div>
  );
};

export default NotFoundPage;
