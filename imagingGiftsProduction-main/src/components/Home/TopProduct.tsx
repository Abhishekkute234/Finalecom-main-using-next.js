"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Rate from "../Other/Rate";

interface TopProductProps {
  products: any[];
  loading: boolean;
}

const TopProduct: React.FC<TopProductProps> = ({ products, loading }) => {
  const router = useRouter();

  const handleDetailProduct = (productId: string) => {
    router.push(`/product?id=${productId}`);
  };

  return (
    <div className="top-product bg-white border rounded-lg md:mt-[60px] mt-10 md:py-[60px] py-10">
      <div className="container mx-auto px-4">
        <div className="heading flex items-center justify-between gap-5 flex-wrap mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase border-b-4 border-blue-500 pb-2">
            Top Rated Products
          </h2>
          <Link
            href="/shop"
            className="text-[#2a3689] font-medium hover:text-[#2a3689] transition border-b-2 border-transparent hover:border-blue-500"
          >
            View All
          </Link>
        </div>

        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5">
          {loading ? (
            <div className="flex justify-center items-center w-full py-10">
              <span className="text-lg font-medium text-gray-500">Loading...</span>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="product-item flex items-center gap-4 p-4 border rounded-lg bg-white  transition cursor-pointer"
                onClick={() => handleDetailProduct(product._id)}
              >
                {/* Compact Image */}
                <div className="w-[100px] h-[100px] flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    src={product.thumbImage || "/images/product/1000x1000.png"}
                    alt={product.title || "Product"}
                    unoptimized
                  />
                </div>

                {/* Compact Info */}
                <div className="flex flex-col justify-center flex-1">
                  <span className="text-xs text-[#2a3689] font-medium uppercase">
                    {product.brand || "Unknown Brand"}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {product.productName || "Untitled Product"}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Rate currentRate={product.rate || 5} size={12} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-gray-900">
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
