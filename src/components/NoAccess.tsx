"use client";

import { LockKeyhole } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton } from "@clerk/nextjs";

interface NoAccessProps {
  details?: string;
}

const NoAccess = ({ details = "cart items and checkout." }: NoAccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Icon */}
      <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4 shadow-md">
        <LockKeyhole className="w-10 h-10" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>

      {/* Message */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        You don’t have permission to view this page. <br />
        Please sign in to view{" "}
        <span className="font-semibold text-gray-800">{details}</span>.
      </p>

      {/* CTA */}
      <SignInButton mode="modal">
        <Button
          size="lg"
          className="bg-kitenge-red hover:bg-kitenge-gold text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Sign In
        </Button>
      </SignInButton>
    </div>
  );
};

export default NoAccess;
