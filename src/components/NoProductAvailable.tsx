import { PackageOpen } from "lucide-react";
import { motion } from "framer-motion";

const NoProductAvailable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-inner"
    >
      <div className="p-6 rounded-full bg-kitenge-red/10">
        <PackageOpen className="w-12 h-12 text-kitenge-red" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        No Products Found
      </h2>
      <p className="text-gray-500 max-w-sm dark:text-gray-400">
        Looks like there are no products in this category yet. Please check back
        later or explore other collections.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 rounded-full bg-kitenge-red text-white font-medium shadow hover:shadow-lg transition"
        onClick={() => (window.location.href = "/shop")}
      >
        Browse All Products
      </motion.button>
    </motion.div>
  );
};

export default NoProductAvailable;
