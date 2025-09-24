import { ClerkLoaded, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import CartIcon from "./CartIcon";
import Container from "./Container";
import FavouriteIcon from "./FavouriteIcon";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import SignIn from "./SignIn";
import Link from "next/link";
import { Logs } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders =await getMyOrders(userId)
  }
  return (
    <header className="bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between">
        {/* Left side */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo className="hidden md:flex" />
        </div>

        {/* Center nav */}
        <HeaderMenu />

        {/* Right side */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-4">
          <SearchBar />
          <CartIcon />
          <FavouriteIcon />

          <ClerkLoaded>
            <SignedIn>
              <Link
                href={"/orders"}
                className="group relative group p-2 rounded-full hoverEffect hover:bg-kitenge-cream"
              >
                <Logs />
                <span className="absolute -top-1 -right-1 bg-kitenge-red text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center transform group-hover:scale-110 transition-transform hoverEffect">
                  {orders?.length ? orders?.length : 0}
                </span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignIn />
            </SignedOut>
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
