"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Rate from "../Other/Rate";

interface TopProductProps {
  products: any[];    // Array of products
  loading: boolean;   // Loading state
}

const TopProduct: React.FC<TopProductProps> = ({ products, loading }) => {
  const router = useRouter();

  const handleDetailProduct = (productId: string) => {
    // redirect to product detail page
    router.push(`/product?id=${productId}`);
  };

  return (
    <div className="top-product bg-gradient-to-b  to-white rounded-lg md:mt-[60px] mt-10 md:py-[60px] py-10">
      <div className="container mx-auto px-4">
        <div className="heading flex items-center justify-between gap-5 flex-wrap mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase border-b-4 border-blue-500 pb-2">
            Top Rated
          </h2>
          <Link
            href="/shop/breadcrumb-img"
            className="text-blue-600 font-medium hover:text-blue-800 transition border-b-2 border-transparent hover:border-blue-500"
          >
            View All
          </Link>
        </div>

        {/* List section */}
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-8">
          {loading ? (
            /* Loading state */
            <div className="flex justify-center items-center w-full py-10">
              <span className="text-lg font-medium text-gray-500">Loading...</span>
            </div>
          ) : products.length > 0 ? (
            /* Map your backend data here */
            products.map((product) => (
              <div
                key={product._id}
                className="product-item flex items-center gap-4 bg-white p-5 rounded-lg shadow-md transition cursor-pointer"
                onClick={() => handleDetailProduct(product._id)}
              >
                <div className="bg-img w-[120px] lg:w-[150px] flex-shrink-0 aspect-square overflow-hidden rounded-lg">
                  <Image
                    width={5000}
                    height={5000}
                    className="w-full h-full object-cover"
                    src={product.thumbImage || "/images/product/1000x1000.png"}
                    alt={product.title || "Product"}
                  />
                </div>
                <div className="product-info">
                  <span className="block text-sm font-semibold text-gray-600 uppercase">
                    {product.brand || "Unknown Brand"}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-gray-800">
                    {product.productName || "Untitled Product"}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Rate currentRate={product.rate || 5} size={14} />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xl font-semibold">
                      ₹{product.priceDetails.offerPrice ?? "0.00"}
                    </span>
                    {product.priceDetails.mrp && (
                      <del className="text-sm text-gray-400">
                        ₹{product.priceDetails.mrp}
                      </del>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* No Products */
            <div className="flex justify-center items-center w-full py-10">
              <p className="text-lg font-medium text-gray-500">
                No top rated products available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
