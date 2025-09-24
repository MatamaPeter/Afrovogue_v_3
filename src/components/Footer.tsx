"use client";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, Subtitle } from "./ui/text";
import { categoriesData, quickLinksData } from "../../constants/data";
import Link from "next/link";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

import { useEffect, useState } from "react";


const Footer = () => {
  const CurrentYear = () => {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
      setYear(new Date().getFullYear());
    }, []);

    return <>{year}</>;
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <Container>
        <FooterTop />
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Logo />
            <SubText className="text-gray-600 leading-relaxed">
              Discover comfortable, elegant, and stylish African attires at
              <span className="font-semibold text-kitenge-red"> Afrovogue</span>
              . Elevate your style with us.
            </SubText>
            <SocialMedia />
          </div>

          {/* Quick Links */}
          <div>
            <Subtitle className="text-lg font-semibold mb-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-kitenge-red">
              Quick Links
            </Subtitle>
            <ul className="space-y-3.5">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-gray-600 hover:text-kitenge-red transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-kitenge-red transition-colors"></span>
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <Subtitle className="text-lg font-semibold mb-6 pb-2 relative after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-kitenge-red">
              Categories
            </Subtitle>
            <ul className="space-y-3.5">
              {categoriesData?.slice(0,6).map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-gray-600 hover:text-kitenge-red transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-kitenge-red transition-colors"></span>
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <Subtitle className="text-lg font-semibold mb-2">
              Newsletter
            </Subtitle>
            <SubText className="text-gray-600">
              Subscribe to our newsletter to receive updates and exclusive
              offers
            </SubText>
            <form className="space-y-4" action="">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kitenge-red/30 focus:border-kitenge-red outline-none transition-all placeholder:text-gray-400"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button className="bg-kitenge-red hover:bg-kitenge-red/90 w-full py-3.5 rounded-lg transition-all duration-300 hover:shadow-lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>
            © <CurrentYear /> Afrovogue. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
