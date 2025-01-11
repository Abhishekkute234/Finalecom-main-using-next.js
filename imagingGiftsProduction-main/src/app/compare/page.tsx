"use client";
import React from "react";
import Image from "next/image";

import { ProductType } from "@/type/ProductType";

import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import Rate from "@/components/Other/Rate";

const Compare = () => {
  const { compareState } = useCompare();
  const { cartState, addToCart, updateCart } = useCart();
  const { openModalCart } = useModalCartContext();

  const handleAddToCart = (productItem: ProductType) => {
    if (!cartState.cartArray.find((item) => item.id === productItem.id)) {
      addToCart({ ...productItem });
      updateCart(productItem.id, productItem.quantityPurchase, "", "");
    } else {
      updateCart(productItem.id, productItem.quantityPurchase, "", "");
    }
    openModalCart();
  };

  return (
    <div className="compare-block md:py-20 py-10">
      <div className="container">
        <div className="content-main">
          {/* Compare table */}
          <div className="compare-table border border-line rounded-2xl overflow-hidden">
            <table
              className="w-full border-collapse table-fixed"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                {/* Top row for images and product names */}
                <tr>
                  <th className="bg-gray-100 w-1/5 p-4 text-left"></th>
                  {compareState.compareArray.map((item) => (
                    <th
                      key={item.id}
                      className="p-4 border-l border-line text-center w-1/5"
                    >
                      <Image
                        src={item.thumbImage || "/default-image.jpg"} // Fallback to a default image
                        width={150}
                        height={200}
                        alt={item.thumbImage || "default image"}
                        className="w-[1000px]"
                      />

                      <div className="text-title">{item.productName}</div>
                      <div className="caption2 font-semibold text-secondary2 uppercase">
                        {item.brand}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Rating Row */}
                <tr>
                  <td className="text-button p-4 text-left">Rating</td>
                  {compareState.compareArray.map((item) => (
                    <td
                      key={item.id}
                      className="border-t border-l border-line p-4 text-center"
                    >
                      <Rate currentRate={item.rate} size={12} />
                      <p className="pl-1">(1.234)</p>
                    </td>
                  ))}
                </tr>

                {/* Price Row */}
                <tr>
                  <td className="text-button p-4 text-left">Price</td>
                  {compareState.compareArray.map((item) => (
                    <td
                      key={item.id}
                      className="border-t border-l border-line p-4 text-center"
                    >
                      ${item.priceDetails.offerPrice}.00
                    </td>
                  ))}
                </tr>

                {/* Brand Row */}
                <tr>
                  <td className="text-button p-4 text-left">Brand</td>
                  {compareState.compareArray.map((item) => (
                    <td
                      key={item.id}
                      className="border-t border-l border-line p-4 text-center capitalize"
                    >
                      {item.brand}
                    </td>
                  ))}
                </tr>

                {/* Key Specifications Row */}
                <tr>
                  <td className="text-button p-4 text-left">
                    Key Specifications
                  </td>
                  {compareState.compareArray.map((item) => (
                    <td
                      key={item.id}
                      className="border-t border-l border-line p-4 text-center"
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.technicalSpecifications?.keySpecifications || "N/A"}
                    </td>
                  ))}
                </tr>

                {/* Description Row */}
                <tr>
                  <td className="text-button p-4 text-left">Description</td>
                  {compareState.compareArray.map((item) => (
                    <td
                      key={item.id}
                      className="border-t border-l border-line p-4 text-center text-secondary"
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.detailedDescription || "N/A"}
                    </td>
                  ))}
                </tr>

                {/* Add to Cart Row */}
                <tr>
                  <td className="text-button p-4 text-left">Add To Cart</td>
                  {compareState.compareArray.map((item) => (
                    <td
                      key={item.id}
                      className="border-t border-l border-line p-4 text-center"
                    >
                      <button
                        className="button-main py-1.5 px-5"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add To Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
