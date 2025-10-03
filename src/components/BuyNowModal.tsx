"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  X,
  ShoppingCart,
  CreditCard,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    images: string[];
    buyNowPrice: number;
    seller: {
      name: string;
      rating: number;
    };
  };
}

export default function BuyNowModal({
  isOpen,
  onClose,
  item,
}: BuyNowModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<
    "confirm" | "shipping" | "payment" | "success"
  >("confirm");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [shippingAddress, setShippingAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "Bangladesh",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">(
    "card"
  );

  const shippingCost = 50;
  const totalAmount = item.buyNowPrice + shippingCost;

  const handlePurchase = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auctions/${item.id}/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      setStep("success");

      // Redirect to orders page after a delay
      setTimeout(() => {
        onClose();
        router.push("/dashboard?tab=orders");
      }, 3000);
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidShipping = () => {
    return (
      shippingAddress.line1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {step === "confirm" && "Confirm Purchase"}
            {step === "shipping" && "Shipping Address"}
            {step === "payment" && "Payment Method"}
            {step === "success" && "Purchase Complete!"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="mt-6">
          {step === "confirm" && (
            <div className="space-y-6">
              {/* Item Preview */}
              <div className="flex gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-slate-400">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Seller: {item.seller.name} ({item.seller.rating}★)
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ৳{item.buyNowPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex justify-between">
                  <span>Item Price:</span>
                  <span>৳{item.buyNowPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>৳{shippingCost}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 dark:border-slate-600">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>৳{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("shipping")}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.line1}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        line1: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.line2}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        line2: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      State/Division *
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Postal Code *
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={shippingAddress.country}
                      readOnly
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 dark:border-slate-600 dark:bg-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("payment")}
                  disabled={!isValidShipping()}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Choose Payment Method
                </h3>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "card")
                      }
                      className="text-blue-600"
                      name="paymentMethod"
                      aria-label="Credit/Debit Card payment method"
                    />
                    <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pay securely with your card
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    <input
                      type="radio"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "bank_transfer")
                      }
                      className="text-blue-600"
                      name="paymentMethod"
                      aria-label="Bank transfer payment method"
                    />
                    <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Direct bank transfer
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Item Price:</span>
                    <span>৳{item.buyNowPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>৳{shippingCost}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1 dark:border-slate-600">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>৳{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Complete Purchase
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Purchase Successful!
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your order has been placed successfully. You will receive a
                  confirmation email shortly.
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Redirecting to your orders page...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
