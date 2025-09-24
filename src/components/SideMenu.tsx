"use client";
import { FC } from "react";
import Logo from "./Logo";
import { X, ChevronRight } from "lucide-react";
import { headerData } from "../../constants/data";
import Link from "next/link";
import SocialMedia from "./SocialMedia";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
            className="fixed inset-y-0 left-0 z-50 w-80 h-screen shadow-2xl"
          >
            <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-xl border-r border-gray-200/50">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Logo className="text-gray-700 hover:text-kitenge-red transition-colors duration-300" />
                </motion.div>
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ delay: 0.1 }}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  onClick={onClose}
                >
                  <X className="h-5 w-5 text-gray-600 group-hover:text-kitenge-red transition-colors" />
                </motion.button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col space-y-1">
                  {headerData.map((item, i) => (
                    <motion.div
                      key={item?.title}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.08 + 0.2,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <Link
                        href={item?.href}
                        className="group flex items-center justify-between py-4 px-5 rounded-2xl hover:bg-kitenge-red/5 hover:shadow-sm transition-all duration-300 text-gray-700 hover:text-kitenge-red border border-transparent hover:border-kitenge-red/10"
                        onClick={onClose}
                      >
                        <span className="font-medium text-sm tracking-wide">
                          {item?.title}
                        </span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 border-t border-gray-100 space-y-6 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm"
              >
                {/* Social Media */}
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100">
                    <SocialMedia />
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-kitenge-red to-kitenge-red/90 hover:from-kitenge-red/90 hover:to-kitenge-red shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  onClick={onClose}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative text-sm tracking-wide">
                    Contact Us
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
