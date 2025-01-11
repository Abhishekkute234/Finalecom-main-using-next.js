"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";

// Context imports
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";

// Components
import Rate from "../Other/Rate";

const ModalQuickview: React.FC = () => {
  // Quickview
  const { selectedProduct, closeQuickview } = useModalQuickviewContext();

  // Cart
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();

  // Wishlist
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();

  // Compare
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();

  // Derived discount (if both MRP & Offer Price exist)
  const percentSale =
    selectedProduct?.priceDetails?.mrp &&
    selectedProduct?.priceDetails?.offerPrice
      ? Math.floor(
          100 -
            (selectedProduct.priceDetails.offerPrice /
              selectedProduct.priceDetails.mrp) *
              100
        )
      : 0;

  // Safely get the quantityPurchase (fallback to 1)
  const currentQuantity = selectedProduct?.quantityPurchase ?? 1;

  const handleIncreaseQuantity = () => {
    if (!selectedProduct) return;

    const updatedQuantity = currentQuantity + 1;
    selectedProduct.quantityPurchase = updatedQuantity;

    // Update the cart if the item is already in the cart
    updateCart(
      selectedProduct.id,
      updatedQuantity,
      selectedProduct.productName ?? "Unknown Product",
      selectedProduct.categories?.main ?? "Uncategorized"
    );
  };

  const handleDecreaseQuantity = () => {
    if (!selectedProduct) return;

    const updatedQuantity = Math.max(1, currentQuantity - 1);
    selectedProduct.quantityPurchase = updatedQuantity;

    // Update the cart if the item is already in the cart
    updateCart(
      selectedProduct.id,
      updatedQuantity,
      selectedProduct.productName ?? "Unknown Product",
      selectedProduct.categories?.main ?? "Uncategorized"
    );
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const inCart = cartState.cartArray.find(
      (item) => item.id === selectedProduct.id
    );

    if (!inCart) {
      addToCart({
        ...selectedProduct,
        quantityPurchase: currentQuantity,
      });
    }
    updateCart(
      selectedProduct.id,
      currentQuantity,
      selectedProduct.productName ?? "Unknown Product",
      selectedProduct.categories?.main ?? "Uncategorized"
    );

    openModalCart();
    closeQuickview();
  };

  const handleAddToWishlist = () => {
    if (!selectedProduct) return;
    const isInWishlist = wishlistState.wishlistArray.some(
      (item) => item.id === selectedProduct.id
    );

    if (isInWishlist) {
      removeFromWishlist(selectedProduct.id);
    } else {
      addToWishlist(selectedProduct);
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    if (!selectedProduct) return;
    const isInCompare = compareState.compareArray.some(
      (item) => item.id === selectedProduct.id
    );

    if (!isInCompare && compareState.compareArray.length >= 3) {
      alert("Compare up to 3 products");
      return;
    }

    if (isInCompare) {
      removeFromCompare(selectedProduct.id);
    } else {
      addToCompare(selectedProduct);
    }
    openModalCompare();
  };

  // If no product is selected, render nothing
  if (!selectedProduct) return null;

  return (
    <div className="modal-quickview-block" onClick={closeQuickview}>
      <div
        className={`modal-quickview-main py-6 ${selectedProduct ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full max-md:flex-col-reverse gap-y-6">
          {/* LEFT COLUMN: Images */}
          <div className="left lg:w-[388px] md:w-[300px] flex-shrink-0 px-6">
            <div className="list-img max-md:flex items-center gap-4">
              {selectedProduct.images?.map((item, index) => (
                <div
                  className="bg-img w-full aspect-[3/4] max-md:w-[150px] max-md:flex-shrink-0 rounded-[20px] overflow-hidden md:mt-6"
                  key={index}
                >
                  <Image
                    src={item || "/placeholder-image.jpg"}
                    width={1500}
                    height={2000}
                    alt={item}
                    priority={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT COLUMN: Details */}
          <div className="right w-full px-4">
            <div className="heading pb-6 px-4 flex items-center justify-between relative">
              <div className="heading5">Quick View</div>
              <div
                className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                onClick={closeQuickview}
              >
                <Icon.X size={14} />
              </div>
            </div>
            <div className="product-infor px-4">
              <div className="flex justify-between">
                <div>
                  <div className="caption2 text-secondary font-semibold uppercase">
                    {selectedProduct.categories?.main ?? "Uncategorized"}
                  </div>
                  <div className="heading4 mt-1">
                    {selectedProduct.productName}
                  </div>
                </div>
                <div
                  className={`add-wishlist-btn w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-lg duration-300 flex-shrink-0 hover:bg-black hover:text-white ${
                    wishlistState.wishlistArray.some(
                      (item) => item.id === selectedProduct.id
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={handleAddToWishlist}
                >
                  {wishlistState.wishlistArray.some(
                    (item) => item.id === selectedProduct.id
                  ) ? (
                    <Icon.Heart size={20} weight="fill" className="text-red" />
                  ) : (
                    <Icon.Heart size={20} />
                  )}
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Rate currentRate={selectedProduct.rate || 0} size={14} />
                <span className="caption1 text-secondary">(1,234 reviews)</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                <div className="product-price heading5">
                  ${selectedProduct.priceDetails.offerPrice}.00
                </div>
                <div className="w-px h-4 bg-line"></div>
                {selectedProduct.priceDetails.mrp && (
                  <>
                    <div className="product-origin-price font-normal text-secondary2">
                      <del>${selectedProduct.priceDetails.mrp}.00</del>
                    </div>
                    <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                      -{percentSale}%
                    </div>
                  </>
                )}
                <div className="desc text-secondary mt-3">
                  {selectedProduct.shortDescription}
                </div>
              </div>
              <div className="text-title mt-5">Quantity:</div>
              <div className="choose-quantity flex items-center max-xl:flex-wrap lg:justify-between gap-5 mt-3">
                <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                  <Icon.Minus
                    onClick={handleDecreaseQuantity}
                    className={`${
                      currentQuantity === 1 ? "disabled" : ""
                    } cursor-pointer body1`}
                  />
                  <div className="body1 font-semibold">{currentQuantity}</div>
                  <Icon.Plus
                    onClick={handleIncreaseQuantity}
                    className="cursor-pointer body1"
                  />
                </div>
                <div
                  onClick={handleAddToCart}
                  className="button-main w-full text-center bg-white text-black border border-black cursor-pointer"
                >
                  Add To Cart
                </div>
              </div>
              <div className="more-infor mt-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Icon.ArrowClockwise className="body1" />
                    <div className="text-title">Description</div>
                    
                  </div>
                  <div className="desc text-secondary mt-3">
                  {selectedProduct.detailedDescription}
                </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default ModalQuickview;
