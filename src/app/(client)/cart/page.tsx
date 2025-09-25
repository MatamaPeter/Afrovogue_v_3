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
import {
  createCheckoutSession,
  Metadata,
} from "../../../../actions/createCheckoutSession";
import AddAddressDialog from "@/components/AddAddressDialog";
import { Input } from "@/components/ui/input";

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
  const [paymentOption, setChecked] = useState<"stripe" | "mpesa">("stripe");

  // Mpesa number + validation
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [mpesaError, setMpesaError] = useState("");

  const validateMpesaNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, "");
    // Accepts +2547XXXXXXXX or 07XXXXXXXX
    const pattern = /^(\+2547\d{8}|07\d{8})$/;
    return pattern.test(cleaned);
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const query = `*[_type == "address" && email == "${userEmail}"] | order(createdAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);

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

  const handleCheckout = async () => {
    if (paymentOption === "mpesa" && !validateMpesaNumber(mpesaNumber)) {
      setMpesaError(
        "Please enter a valid M-Pesa number (e.g. 07XXXXXXXX or +2547XXXXXXXX)"
      );
      return;
    }

    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
        mpesaNumber: paymentOption === "mpesa" ? mpesaNumber : undefined,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.log("Error creating checkout session", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-10">
      <Container>
        {groupedItems?.length ? (
          <>
            {/* Page Header */}
            <div className="flex items-center gap-3 py-8">
              <div className="bg-kitenge-red/10 text-kitenge-red p-3 rounded-xl shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <Title className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </Title>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                  {groupedItems?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="border-b border-gray-100 last:border-b-0 py-6 flex items-center justify-between gap-6 transition-colors hover:bg-gray-50/50 rounded-lg px-3"
                      >
                        {/* Product Info */}
                        <div className="flex flex-1 items-start gap-4">
                          {product?.images && (
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="shrink-0 border-2 border-gray-100 rounded-xl overflow-hidden group transition-all hover:border-kitenge-red/20 hover:shadow-md"
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
                            <div className="space-y-2">
                              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                {product?.name}
                              </h2>
                              <p className="text-sm text-gray-600">
                                Variant:{" "}
                                <span className="font-medium text-gray-800">
                                  {product?.variant}
                                </span>
                              </p>
                              {product?.status && (
                                <p className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full inline-block border border-gray-200">
                                  {product?.status}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mt-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AddToWishlistButton product={product} />
                                  </TooltipTrigger>
                                  <TooltipContent className="font-semibold bg-gray-900 text-white">
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
                                      className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer hover:scale-110"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="font-semibold bg-gray-900 text-white">
                                    Remove Item
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>

                        {/* Price + Quantity */}
                        <div className="flex flex-col items-end justify-between h-28 md:h-36 space-y-4">
                          <PriceFormatter
                            amount={(product?.price as number) * itemCount}
                            className="font-bold text-xl text-gray-900"
                          />
                          <QuantityButtons product={product} />
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    onClick={handleResetCart}
                    className="mt-6 w-full font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200 hover:border-red-300 shadow-sm"
                    variant="ghost"
                  >
                    Reset Cart
                  </Button>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                    Order Summary
                  </h3>

                  <div className="space-y-4 text-gray-700">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-semibold text-green-600">
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-gray-900 mt-6 pt-6 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      <PriceFormatter amount={getTotalPrice()} />
                    </span>
                  </div>

                  {/* Payment options */}
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Payment Method
                    </h4>
                    <RadioGroup
                      value={paymentOption}
                      onValueChange={(val) =>
                        setChecked(val as "stripe" | "mpesa")
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-kitenge-red/30 transition-colors">
                        <RadioGroupItem
                          value="stripe"
                          id="stripe"
                          className="text-kitenge-red"
                        />
                        <Label
                          htmlFor="stripe"
                          className="cursor-pointer font-medium text-gray-900"
                        >
                          Stripe
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-kitenge-red/30 transition-colors">
                        <RadioGroupItem
                          value="mpesa"
                          id="mpesa"
                          className="text-kitenge-red"
                        />
                        <Label
                          htmlFor="mpesa"
                          className="cursor-pointer font-medium text-gray-900"
                        >
                          M-Pesa
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentOption === "mpesa" && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid w-full items-center gap-2">
                        <Label
                          htmlFor="phone"
                          className="font-medium text-gray-900"
                        >
                          M-Pesa Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254712345678"
                          value={mpesaNumber}
                          onChange={(e) => {
                            setMpesaNumber(e.target.value);
                            if (mpesaError) setMpesaError("");
                          }}
                          onBlur={() => {
                            if (
                              mpesaNumber &&
                              !validateMpesaNumber(mpesaNumber)
                            ) {
                              setMpesaError(
                                "Enter a valid M-Pesa number (e.g. 07XXXXXXXX or +2547XXXXXXXX)"
                              );
                            }
                          }}
                          className={
                            mpesaError
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "border-gray-300 focus:border-kitenge-red"
                          }
                        />
                        {mpesaError && (
                          <p className="text-sm text-red-600 font-medium">
                            {mpesaError}
                          </p>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900">
                          Can&apos;t pay through M-Pesa express?
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                          <li>Go to SIM Toolkit</li>
                          <li>Select M-Pesa</li>
                          <li>Choose Lipa na M-Pesa</li>
                          <li>Select Paybill</li>
                          <li>
                            Enter <b className="text-gray-900">123 456</b> as
                            the business number
                          </li>
                          <li>
                            Enter your{" "}
                            <b className="text-gray-900">phone number</b> as the
                            account number
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mt-6 font-semibold bg-kitenge-gold text-white hover:bg-kitenge-red/90 shadow-lg transition-all duration-200 hover:shadow-xl py-3 text-lg"
                    size="lg"
                    disabled={loading || !selectedAddress}
                    onClick={handleCheckout}
                  >
                    {loading ? "Please wait..." : "Proceed to Checkout"}
                  </Button>

                  {/* Delivery Address */}
                  {addresses && addresses.length > 0 ? (
                    <Card className="mt-6 border border-gray-200 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">
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
                              className={`flex items-start space-x-3 mb-4 rounded-lg p-4 cursor-pointer transition-all border ${
                                selectedAddress?._id === address?._id
                                  ? "bg-kitenge-red/5 border-kitenge-red/20 ring-2 ring-kitenge-red/10"
                                  : "border-gray-200 hover:border-kitenge-red/30 hover:bg-gray-50"
                              }`}
                            >
                              <RadioGroupItem
                                value={address?._id?.toString()}
                                id={address?._id?.toString()}
                                className="text-kitenge-red mt-1"
                              />
                              <Label
                                htmlFor={address?._id?.toString()}
                                className="flex flex-col cursor-pointer flex-1"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-gray-900">
                                    {address?.name}
                                  </span>
                                  {address?.isDefault && (
                                    <span className="text-xs bg-kitenge-red/10 text-kitenge-red px-2 py-1 rounded-full font-medium border border-kitenge-red/20">
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
                                <span className="text-sm text-gray-500 mt-2 font-medium">
                                  {address?.phone}
                                </span>
                                {address?.deliveryInstructions && (
                                  <span className="text-xs text-gray-500 mt-2 italic bg-gray-50 p-2 rounded border">
                                    &quot;{address.deliveryInstructions}&quot;
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button
                          variant="outline"
                          className="w-full mt-2 border-gray-300 hover:border-kitenge-red text-gray-700 font-medium"
                          onClick={() => setIsAddAddressDialogOpen(true)}
                        >
                          + Add New Address
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="mt-6 border border-gray-200 shadow-sm">
                      <CardContent className="text-center py-8">
                        <p className="text-gray-600 mb-4 font-medium">
                          No delivery addresses found.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 hover:border-kitenge-red text-gray-700 font-medium"
                          onClick={() => setIsAddAddressDialogOpen(true)}
                        >
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
