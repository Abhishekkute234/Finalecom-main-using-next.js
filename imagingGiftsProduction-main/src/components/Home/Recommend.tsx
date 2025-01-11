"use client";

import React from "react";
import Product from "../Product/Product";

// Define prop types for Recommend component
interface DealProps {
  products: any[]; // Proper structure for products
  loading: boolean;
}

const Recommend: React.FC<DealProps> = ({ products, loading }) => {
  return (
    <div className="recommend md:mt-[60px] mt-10">
      <div className="container">
        <div className="heading flex items-center justify-between gap-5 flex-wrap">
          <div className="heading3">MirrorLess Cameras</div>
          <a
            href="/shop-breadcrumb-img.html"
            className="text-button pb-0.5 border-b-2 border-black"
          >
            View All
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
                data={item} // Pass the correct 'item' here, ensure it matches the expected ProductProps
              
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

export default Recommend;
