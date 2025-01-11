"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Rate from "../Other/Rate";

interface TopProductProps {
  products: any[];    // Array of products
  loading: boolean;   // Loading state
}

const TopProduct: React.FC<TopProductProps> = ({ products, loading }) => {
  const router = useRouter();

  const handleDetailProduct = (productId: string) => {
    // redirect to product detail page
    router.push(`/product/default?id=${productId}`);
  };

  return (
    <div className="top-product bg-surface md:mt-[60px] mt-10 md:py-[60px] py-10">  
      <div className="container">
        <div className="heading flex items-center justify-between gap-5 flex-wrap">
          <div className="heading3">Top Rated Products</div>
          <Link
            href="/shop/breadcrumb-img"
            className="text-button pb-0.5 border-b-2 border-black"
          >
            View All
          </Link>
        </div>

        {/* List section */}
        <div className="list grid xl:grid-cols-3 sm:grid-cols-2 gap-4 md:mt-10 mt-6">
          {loading ? (
            /* Loading state */
            <div className="flex justify-center items-center w-full">
              <span>Loading...</span>
            </div>
          ) : products.length > 0 ? (
            /* Map your backend data here */
            products.map((product) => (
              <div
                key={product._id}
                className="product-item style-marketplace-list flex items-center gap-2 bg-white py-5 px-[39px] rounded cursor-pointer"
                onClick={() => handleDetailProduct(product._id)}
              >
                <div className="bg-img lg:w-[150px] w-[120px] flex-shrink-0 aspect-1/1">
                  <Image
                    width={5000}
                    height={5000}
                    className="w-full h-full object-cover"
                    src={product.thumbImage || "/images/product/1000x1000.png"}
                    alt={product.title || "Product"}
                  />
                </div>
                <div className="product-infor">
                  <span className="caption2 uppercase block">
                    {product.brand || "Unknown Brand"}
                  </span>
                  <span className="caption2 mt-2">
                    {product.productName || "Untitled Product"}
                  </span>
                  <div className="flex gap-0.5 mt-2">
                    {/* Example star rating; adjust logic as needed */}
                 
                    <Rate currentRate={product.rate || 5} size={14} />
                 
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-title inline-block">
                    ₹{product.priceDetails.offerPrice ?? "0.00"}
                    </span>
                    {product.oldPrice && (
                      <del className="caption2 text-secondary">
                        ${product.oldPrice}
                      </del>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* No Products */
            <div className="flex justify-center items-center w-full">
              <p>No top rated products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
