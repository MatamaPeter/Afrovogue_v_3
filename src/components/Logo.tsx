import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 hover:opacity-90 transition-opacity group",
        className
      )}
    >
      {/* Logo image container */}
      <div className="relative w-12 h-12 flex items-center justify-center rounded-md overflow-hidden">
        <Image
          src="/logo.png"
          alt="Afrovogue logo"
          fill
          sizes="400px"
          priority
          className="object-cover"
        />
      </div>

      {/* Brand text */}
      <div className="flex flex-col leading-tight">
        <span className="text-2xl font-bold text-gray-900 font-sans group-hover:text-kitenge-red hoverEffect ">Afrovogue</span>
        <span className="text-xs text-gray-500 font-normal">
          Premium African fashion
        </span>
      </div>
    </Link>
  );
};

export default Logo;
