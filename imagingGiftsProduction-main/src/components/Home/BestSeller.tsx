"use client";

import React from "react";
import Product from "../Product/Product";

interface DealProps {
  products: any[]; // Array of products
  loading: boolean; // Loading state
}

const BestSeller: React.FC<DealProps> = ({ products, loading }) => {
  return (
    <div className="bg-gradient-to-b  to-white my-10 py-10  rounded-lg">
    <div className="container mx-auto px-4">
      {/* Heading Section */}
      <div className="heading flex items-center justify-between flex-wrap mb-8">
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase border-b-4 border-blue-500 pb-2">
          Best Sellers
        </h2>
        <a
          href="/shop"
          className="text-blue-600 font-medium hover:text-blue-800 transition-all border-b-2 border-transparent hover:border-blue-500"
        >
          View All Deals
        </a>
      </div>

      {/* Product List Section */}
      <div className="list grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6">
        {loading ? (
          <div className="flex justify-center items-center w-full py-10">
            <span className="text-lg font-medium text-gray-500">Loading...</span>
          </div>
        ) : products.length > 0 ? (
          products.map((item) => (
            <Product
              key={item._id}
              data={item}
              type="marketplace"
            />
          ))
        ) : (
          <div className="flex justify-center items-center w-full py-10">
            <p className="text-gray-600 text-lg font-medium">
              No deals available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default BestSeller;
