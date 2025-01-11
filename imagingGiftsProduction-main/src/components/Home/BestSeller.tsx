"use client";

import React from "react";
import Product1 from "../Product/DemoProduct";
import Product from "../Product/Product";

interface DealProps {
  products: any[]; // Array of products
  loading: boolean; // Loading state
}

const BestSeller: React.FC<DealProps> = ({ products, loading }) => {
  return (
    <div className="md:pt-[60px] pt-10">
      <div className="container">
        <div className="heading flex items-center justify-between gap-5 flex-wrap">
          <div className="left flex items-center gap-6 gap-y-3 flex-wrap">
            <div className="heading3">Bestsellers</div>
          </div>
          <a href="/shop" className="text-button pb-1 border-b-2 border-black">
            View All Deals
          </a>
        </div>
        <div className="list grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
          {loading ? (
            <div className="flex justify-center items-center w-full">
              <span>Loading...</span>
            </div>
          ) : products.length > 0 ? (
            products.map((item) => (
              <Product
                key={item._id}
                data={item} // This passes the product object correctly
              
                type="marketplace"
              />
            ))
          ) : (
            <div className="flex justify-center items-center w-full">
              <p>No deals available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
