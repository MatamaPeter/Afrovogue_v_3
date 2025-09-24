import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  className?: string;
}

const Title = ({ children, className }: TextProps) => {
  return (
    <h2
      className={cn(
        "text-2xl font-bold text-kitenge-red capitalize tracking-wide mb-3 font-sans",
        className
      )}
    >
      {children}
    </h2>
  );
};

const Subtitle = ({ children, className }: TextProps) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-900",
        className
      )}
    >
      {children}
    </h3>
  );
};

const SubText = ({ children, className }: TextProps) => {
  return <p className={cn("text-gray-600 text-sm", className)}>{children}</p>;
};

export { Title, Subtitle, SubText };
