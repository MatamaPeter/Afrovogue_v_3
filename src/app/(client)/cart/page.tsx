"use client";

import Container from "@/components/Container";
import useStore from "../../../../store";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Address } from "../../../../sanity.types";
import NoAccess from "@/components/NoAccess";
import EmptyCart from "@/components/EmptyCart";
import { ShoppingBag, Trash } from "lucide-react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddToWishlistButton from "@/components/AddToWishlistButton";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createCheckoutSession, Metadata } from "../../../../actions/createCheckoutSession";
import AddAddressDialog from "@/components/AddAddressDialog";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
    getGroupedItems,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const groupedItems = getGroupedItems();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);

 const fetchAddresses = async () => {
   setLoading(true);
   try {
     // Filter addresses by user email and order by creation date
     const userEmail = user?.primaryEmailAddress?.emailAddress;
     // Fixed query syntax
     const query = `*[_type == "address" && email == "${userEmail}"] | order(createdAt desc)`;
     const data = await client.fetch(query);
     setAddresses(data);

     // Find default address or use first one
     const defaultAddress = data.find((addr: Address) => addr.isDefault);
     if (defaultAddress) {
       setSelectedAddress(defaultAddress);
     } else if (data.length > 0) {
       setSelectedAddress(data[0]);
     }
   } catch (error) {
     console.log("Addresses fetching error:", error);
   } finally {
     setLoading(false);
   }
 };

  const handleAddressAdded = () => {
    fetchAddresses();
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchAddresses();
    }
  }, [user]);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };


  if (!isSignedIn)
    return <NoAccess details="your shopping cart and checkout." />;
  const handleCheckout = async() => {
    setLoading(true)
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
      
    } catch (error) {
      console.log("Error creating checkout section", error)
    } finally {
      setLoading(false);
    }
}
  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-10">
      <Container>
        {groupedItems?.length ? (
          <>
            {/* Page Header */}
            <div className="flex items-center gap-3 py-6">
              <div className="bg-kitenge-red/10 text-kitenge-red p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <Title>Shopping Cart</Title>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-md p-5">
                  {groupedItems?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="border-b last:border-b-0 py-4 flex items-center justify-between gap-6"
                      >
                        {/* Product Info */}
                        <div className="flex flex-1 items-start gap-4">
                          {product?.images && (
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="shrink-0 border rounded-xl overflow-hidden group"
                            >
                              <Image
                                src={urlFor(product?.images[0]).url()}
                                alt="productImage"
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-28 md:w-36 h-28 md:h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </Link>
                          )}
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="space-y-1">
                              <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
                                {product?.name}
                              </h2>
                              <p className="text-sm text-gray-600">
                                Variant:{" "}
                                <span className="font-medium text-gray-800">
                                  {product?.variant}
                                </span>
                              </p>
                              {product?.status && (
                                <p className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-full inline-block">
                                  {product?.status}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AddToWishlistButton product={product} />
                                  </TooltipTrigger>
                                  <TooltipContent className="font-semibold">
                                    Add to Wishlist
                                  </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger>
                                    <Trash
                                      onClick={() => {
                                        deleteCartProduct(product?._id);
                                        toast.success("Product removed!");
                                      }}
                                      className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="font-semibold">
                                    Remove Item
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>

                        {/* Price + Quantity */}
                        <div className="flex flex-col items-end justify-between h-28 md:h-36">
                          <PriceFormatter
                            amount={(product?.price as number) * itemCount}
                            className="font-bold text-lg text-gray-900"
                          />
                          <QuantityButtons product={product} />
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    onClick={handleResetCart}
                    className="mt-6 w-full font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    variant="ghost"
                  >
                    Reset Cart
                  </Button>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-medium text-green-600">
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-6 pt-4 border-t">
                    <span>Total</span>
                    <span>
                      <PriceFormatter amount={getTotalPrice()} />
                    </span>
                  </div>

                  <Button
                    className="w-full mt-6 font-semibold bg-gradient-to-r from-kitenge-gold to-yellow-500 text-white hover:opacity-90 shadow-lg"
                    size="lg"
                    disabled={loading || !selectedAddress}
                    onClick={handleCheckout}
                  >
                    {loading ? "Please wait..." : "Proceed to Checkout"}
                  </Button>

                  {/* Delivery Address */}
                  {addresses && addresses.length > 0 ? (
                    <Card className="mt-6 border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={selectedAddress?._id?.toString()}
                          onValueChange={(value) => {
                            const address = addresses.find(
                              (addr) => addr._id.toString() === value
                            );
                            setSelectedAddress(address || null);
                          }}
                        >
                          {addresses?.map((address) => (
                            <div
                              key={address?._id}
                              className={`flex items-start space-x-3 mb-4 rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedAddress?._id === address?._id
                                  ? "bg-kitenge-red/5 ring-1 ring-kitenge-red"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <RadioGroupItem
                                value={address?._id?.toString()}
                                id={address?._id?.toString()}
                              />
                              <Label
                                htmlFor={address?._id?.toString()}
                                className="flex flex-col cursor-pointer flex-1"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">
                                    {address?.name}
                                  </span>
                                  {address?.isDefault && (
                                    <span className="text-xs bg-kitenge-red/10 text-kitenge-red px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-600 mb-1">
                                  {address?.address}, {address?.area}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {address?.city === "other"
                                    ? address?.customCity
                                    : address?.city}
                                  , {address?.county}
                                  {address?.postalCode &&
                                    ` - ${address.postalCode}`}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  {address?.phone}
                                </span>
                                {address?.deliveryInstructions && (
                                  <span className="text-xs text-gray-500 mt-1 italic">
                                    &quot;{address.deliveryInstructions}&quot;
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button variant="outline" className="w-full mt-2" onClick={() => setIsAddAddressDialogOpen(true)}>
                          + Add New Address
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="mt-6 border-0 shadow-sm">
                      <CardContent className="text-center py-6">
                        <p className="text-gray-500 mb-4">
                          No delivery addresses found.
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => setIsAddAddressDialogOpen(true)}>
                          + Add Delivery Address
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </Container>

      <AddAddressDialog
        isOpen={isAddAddressDialogOpen}
        onClose={() => setIsAddAddressDialogOpen(false)}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  );
};

export default CartPage;
