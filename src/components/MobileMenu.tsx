"use client";
import { AlignLeft } from "lucide-react";
import SideMenu from "./SideMenu";
import { useState } from "react";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-kitenge-red hoverEffect md:hidden hover:cursor-pointer" />
      </button>
          <SideMenu
              isOpen={isSidebarOpen}
              onClose={()=>setIsSidebarOpen(false)}
          />
    </>
  );
};

export default MobileMenu;
