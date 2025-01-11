"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from "@/type/ProductType";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import Rate from "../Other/Rate";

interface ProductProps {
  
  data: ProductType;
  type: string;
}



const Product: React.FC<ProductProps> = ({ data, type }) => {
  // Destructure fields, including the MongoDB _id
  const { _id, productName, priceDetails, thumbImage, rate } = data;

  // Local states for color/size selection
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");

  // Access your Cart Context
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();

  // Other contexts (wishlist, compare, etc.)
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const { openQuickview } = useModalQuickviewContext();

  const router = useRouter();

  // Transform _id -> id right before adding to cart
  const handleAddToCart = () => {
    const productToAdd = {
      ...data,
      id: _id, // Add a new "id" property for cart consistency
    };

    // Check if the item is already in the cart
    if (!cartState.cartArray.find((item) => item.id === productToAdd.id)) {
      // Not in cart: Add
      addToCart(productToAdd);
      updateCart(
        productToAdd.id,
        productToAdd.quantityPurchase || 1,
        activeSize,
        activeColor
      );
    } else {
      // Already in cart: Update
      updateCart(
        productToAdd.id,
        productToAdd.quantityPurchase || 5,
        activeSize,
        activeColor
      );
    }
    openModalCart();
  };

  const handleBuyNow = () => {
    if (!_id) {
      alert("Item not available.");
      return;
    }
    // Same transform if you'd like consistency
    const productToAdd = { ...data, id: _id };
    addToCart(productToAdd);
    // After adding, navigate to checkout
    router.push("/checkout");
  };

  // Example: detail page
  const handleDetailProduct = () => {
    router.push(`/product/default?id=${_id}`);
  };

  // WishList logic
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (wishlistState.wishlistArray.some((item) => item.id === _id)) {
      removeFromWishlist(_id);
    } else {
      // transform so that wishlist also has .id (optional)
      const productToAdd = { ...data, id: _id };
      addToWishlist(productToAdd);
    }
    openModalWishlist();
  };

  // Compare logic
  const handleAddToCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      compareState.compareArray.length >= 3 &&
      !compareState.compareArray.some((item) => item.id === _id)
    ) {
      alert("Compare up to 3 products");
      return;
    }

    if (compareState.compareArray.some((item) => item.id === _id)) {
      removeFromCompare(_id);
    } else {
      const productToAdd = { ...data, id: _id };
      addToCompare(productToAdd);
    }
    openModalCompare();
  };

  // Quickview logic
  const handleQuickviewOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickview(data);
  };

  if (!data) {
    return <p>Error loading product data</p>;
  }

  // Rendering
  return (
    <>
      {type === "marketplace" && (
        <div
          className="product-item style-marketplace p-4 border border-line rounded-2xl"
          onClick={handleDetailProduct}
        >
          <div className="bg-img relative w-full">
            <Image
              className="w-full aspect-square max-w-full max-h-48 sm:max-h-64 object-cover"
              width={5000}
              height={5000}
              src={thumbImage || "/placeholder.jpg"}
              alt={productName || "Product Image"}
              priority
            />

            {/* Action buttons (top-right) */}
            <div className="list-action flex flex-col gap-1 absolute top-0 right-0">
              {/* Wishlist */}
              <span
                className={`add-wishlist-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300 ${
                  wishlistState.wishlistArray.some((item) => item.id === _id)
                    ? "active"
                    : ""
                }`}
                onClick={handleAddToWishlist}
              >
                {wishlistState.wishlistArray.some((item) => item.id === _id) ? (
                  <Icon.Heart size={18} weight="fill" className="text-white" />
                ) : (
                  <Icon.Heart size={18} />
                )}
              </span>

              {/* Compare */}
              <span
                className={`compare-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300 ${
                  compareState.compareArray.some((item) => item.id === _id)
                    ? "active"
                    : ""
                }`}
                onClick={handleAddToCompare}
              >
                <Icon.Repeat size={18} className="compare-icon" />
                <Icon.CheckCircle size={20} className="checked-icon" />
              </span>

              {/* Quickview */}
              <span
                className="quick-view-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300"
                onClick={handleQuickviewOpen}
              >
                <Icon.Eye />
              </span>

              {/* Add to Cart */}
              <span
                className="add-cart-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                <Icon.ShoppingBagOpen />
              </span>
            </div>
          </div>

          {/* Product info */}
          <div className="product-infor mt-4 flex flex-col justify-between">
            <span
              className="text-title text-black text-base truncate"
              style={{ lineHeight: "1.25rem" }}
            >
              {productName}
            </span>
            {/* Example rating */}
            <div className="flex items-center mt-3">
                <Rate currentRate={rate || 3} size={14} />
                <span className="caption1 text-secondary">(1,234 reviews)</span>
              </div>

            {/* Price */}
            <div className="flex">
              <span className="text-title inline-block mt-1 text-[#212121] font-semibold">
                ₹{priceDetails?.offerPrice}
              </span>
              <span className="text-title inline-block mt-1 ml-2 text-[#878787] line-through">
                ₹{priceDetails?.mrp}
              </span>
            </div>
          </div>






          {/* Bottom Action Buttons */}
          <div className="action-buttons lg:mt-4 md:mt-4 mt-2 flex justify-between sm:ml-2">
            {/* Add to Cart */}
            <button
              className="py-1 lg:px-4 px-3 bg-transparent border-2 border-gray-300 text-black rounded-lg font-medium text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              Add+
            </button>

            {/* Buy Now */}
            <button
              className="py-1 mx-1 px-4 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow();
              }}
            >
              <span className="sm:hidden">Buy</span>
              <span className="hidden sm:block">Buy Now</span>
            </button>
          </div>
        </div>
      )}

      {/* If you have other types like "grid" or "categories", handle them similarly */}
      {type === "grid" && (
        <div className="product-item grid-type">Grid Layout</div>
      )}

      {/* ... */}
    </>
  );
};

export default Product;
