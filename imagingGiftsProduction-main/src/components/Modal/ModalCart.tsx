"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";

import { ProductType } from "@/type/ProductType";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import CountdownTimeType from "@/type/CountdownType";

const ModalCart = ({
  serverTimeLeft,
}: {
  serverTimeLeft: CountdownTimeType;
}) => {
  const [timeLeft, setTimeLeft] = useState(
    serverTimeLeft || { minutes: 0, seconds: 0 }
  );
  const [activeTab, setActiveTab] = useState<string | undefined>("");

  const { isModalOpen, closeModalCart } = useModalCartContext();
  const { cartState, addToCart, removeFromCart, updateCart } = useCart();

  // ---- State for "You May Also Like" products from backend ----
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>(
    []
  );

  // Cart array from context
  const cartArray = cartState?.cartArray || [];

  // Calculate totals
  let totalCart = cartArray.reduce(
    (acc, item) =>
      acc + (item.priceDetails?.offerPrice || 0) * (item.quantity || 1),
    0
  );
  const moneyForFreeship = 150;

  // Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch recommended products from your backend
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=4");
        const result = await res.json();
        if (result.success) {
          // Transform _id -> id for each product
          const transformed = result.data.map(
            (prod: ProductType & { _id: string }) => ({
              ...prod,
              id: prod._id,
            })
          );
          setRecommendedProducts(transformed);
        } else {
          console.error("Failed to fetch recommended products:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, []);

  // Add recommended product to cart
  const handleAddToCart = (productItem: ProductType) => {
    // Check if product is already in cart
    if (!cartArray.find((item) => item.id === productItem.id)) {
      addToCart(productItem);
      updateCart(productItem.id, productItem.quantityPurchase || 1, "", "");
    } else {
      updateCart(productItem.id, productItem.quantityPurchase || 1, "", "");
    }
  };

  const handleActiveTab = (tab: string) => setActiveTab(tab);

  return (
    <>
      <div className="modal-cart-block" onClick={closeModalCart}>
        <div
          className={`modal-cart-main flex ${isModalOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT SECTION: "You May Also Like" */}
          <div className="left w-1/2 border-r border-line py-6 max-md:hidden">
            <div className="heading5 px-6 pb-3">You May Also Like</div>
            <div className="list px-6">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="item py-5 flex items-center justify-between gap-3 border-b border-line"
                >
                  <div className="infor flex items-center gap-5">
                    <div className="bg-img">
                      <Image
                        src={product.thumbImage || "/placeholder-image.jpg"}
                        width={300}
                        height={300}
                        alt={product.productName || "Unknown"}
                        className="w-[100px] aspect-square flex-shrink-0  object-contain rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="name text-button">
                        {product.productName || "Unknown Product"}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="product-price text-title">
                          Rs. {product.priceDetails?.offerPrice || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <Icon.Handbag />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION: Cart Items */}
          <div className="right cart-block md:w-1/2 w-full py-6 relative overflow-hidden">
            <div className="heading px-6 pb-3 flex items-center justify-between relative">
              <div className="heading5">Shopping Cart</div>
              <div
                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                onClick={closeModalCart}
              >
                <Icon.X size={14} />
              </div>
            </div>

            <div className="time px-6">
              <div className="flex items-center gap-3 px-5 py-3 bg-green rounded-lg">
                <p className="text-3xl">🔥</p>
                <div className="caption1">
                  Your cart will expire in{" "}
                  <span className="text-red caption1 font-semibold">
                    {timeLeft.minutes || 0}:
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds || 0}`
                      : timeLeft.seconds || 0}
                  </span>{" "}
                  minutes!
                  <br />
                  Please checkout now before your items sell out!
                </div>
              </div>
            </div>

            <div className="heading banner mt-3 px-6">
              <div className="text">
                Buy{" "}
                <span className="text-button">
                  $
                  {moneyForFreeship - totalCart > 0
                    ? moneyForFreeship - totalCart
                    : 0}
                  .00
                </span>{" "}
                more to get <span className="text-button">freeship</span>
              </div>
              <div className="tow-bar-block mt-3">
                <div
                  className="progress-line"
                  style={{
                    width:
                      totalCart <= moneyForFreeship
                        ? `${(totalCart / moneyForFreeship) * 100}%`
                        : "100%",
                  }}
                />
              </div>
            </div>

            {/* Cart items from context */}
            <div className="list-product px-6">
              {cartArray.map((product) => (
                <div
                  key={product.id}
                  className="item py-5 flex items-center justify-between gap-3 border-b border-line"
                >
                  <div className="infor flex items-center gap-3 w-full">
                    <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg  overflow-hidden">
                      <Image
                        src={product.thumbImage || "/placeholder-image.jpg"}
                        width={300}
                        height={300}
                        alt={product.productName || "Unknown Product"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="name text-button">
                          {product.productName || "Unknown Product"}
                        </div>
                        <div
                          className="remove-cart-btn caption1 font-semibold text-red underline cursor-pointer"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 w-full">
                        <div className="flex items-center text-secondary2 capitalize">
                          {product.categories.main || "N/A"}/
                          {product.categories.sub || "N/A"}
                        </div>
                        <div className="product-price text-title">
                          Rs.{product.priceDetails?.offerPrice || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
              <div className="flex items-center justify-center lg:gap-14 gap-8 px-6 py-4 border-b border-line">
                <div
                  className="item flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveTab("note")}
                >
                  <Icon.NotePencil className="text-xl" />
                  <div className="caption1">Note</div>
                </div>
                <div
                  className="item flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveTab("shipping")}
                >
                  <Icon.Truck className="text-xl" />
                  <div className="caption1">Shipping</div>
                </div>
                <div
                  className="item flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveTab("coupon")}
                >
                  <Icon.Tag className="text-xl" />
                  <div className="caption1">Coupon</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 px-6">
                <div className="heading5">Subtotal</div>
                <div className="heading5">₹{totalCart}.00</div>
              </div>

              <div className="block-button text-center p-6">
                <div className="flex items-center gap-4">
                  <Link
                    href="/cart"
                    className="button-main basis-1/2 bg-white border border-black text-black text-center uppercase"
                    onClick={closeModalCart}
                  >
                    View cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="button-main basis-1/2 text-center uppercase"
                    onClick={closeModalCart}
                  >
                    Check Out
                  </Link>
                </div>
                <div
                  onClick={closeModalCart}
                  className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                >
                  Or continue shopping
                </div>
              </div>

              {/* Example Tabs */}
              <div
                className={`tab-item note-block ${
                  activeTab === "note" ? "active" : ""
                }`}
              >
                {/* Your Note UI here */}
              </div>
              <div
                className={`tab-item note-block ${
                  activeTab === "shipping" ? "active" : ""
                }`}
              >
                {/* Your Shipping UI here */}
              </div>
              <div
                className={`tab-item note-block ${
                  activeTab === "coupon" ? "active" : ""
                }`}
              >
                {/* Your Coupon UI here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCart;
