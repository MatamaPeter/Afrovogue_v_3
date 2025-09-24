"use client";
import Link from "next/link";
import { headerData } from "../../constants/data";
import { usePathname } from "next/navigation";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
      {headerData.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            className={`
              relative py-2 px-3 text-gray-700 transition-all duration-300 
              hover:text-kitenge-red group
              ${isActive ? "text-kitenge-red font-semibold" : ""}
            `}
            key={item.title}
            href={item.href}
          >
            {item.title}

            {/* Animated underline */}
            <span
              className={`
                absolute left-0 -bottom-1.5 h-0.5 bg-kitenge-red 
                transition-all duration-300 origin-left
                ${isActive ? "w-full scale-x-100" : "w-0 scale-x-0"}
                group-hover:w-full group-hover:scale-x-100
              `}
            />

            {/* Optional subtle background on active/hover */}
            {isActive && (
              <span className="absolute  inset-0 -z-10 bg-kitenge-red/10 rounded-lg" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
