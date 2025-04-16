import Image from "next/image";
import Link from "next/link";
import React from "react";

const BannerBelow = () => {
  return (
    <div className="banner-block py-10 bg-gradient-to-b  to-white rounded-lg">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:gap-8 gap-6">
          {/* Banner 1: Camera Sale */}
          <Link
            href="/shop"
            className="banner-item relative bg-blue-500 hover:bg-blue-600 transition-all duration-500 rounded-xl overflow-hidden shadow-md flex items-center justify-between px-8 py-10"
          >
            <div className="banner-content">
              <h3 className="text-2xl font-bold text-white leading-tight">
                Super Sale <br /> Mirrorless Cameras
              </h3>
              <p className="text-lg text-white mt-2">Save ₹ 4499.00</p>
              <span className="inline-block mt-4 text-sm font-medium text-white border-b-2 border-white">Shop Now</span>
            </div>
            <div className="banner-img w-40 h-40 relative">
              <Image
                src="/images/banner/camera-sale.png"
                alt="Camera Sale"
                layout="fill"
                objectFit="contain"
                className="duration-500"
              />
            </div>
          </Link>
          {/* Banner 2: Accessories Discount */}
          <Link
            href="/shop"
            className="banner-item bg-amber-700 lative bg-red-500 hover:bg-red-600 transition-all duration-500 rounded-xl overflow-hidden shadow-md flex items-center justify-between px-8 py-10"
          >
            <div className="banner-content">
              <h3 className="text-2xl font-bold text-white leading-tight">
                Deals On <br /> Camera Accessories
              </h3>
              <p className="text-lg text-white mt-2">Up to 30% Off</p>
              <span className="inline-block mt-4 text-sm font-medium text-white border-b-2 border-white">Shop Now</span>
            </div>
            <div className="banner-img w-40 h-40 relative">
              <Image
                src="/images/banner/camera-sale.png"
                alt="Camera Accessories Discount"
                layout="fill"
                objectFit="contain"
                className="duration-500"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBelow;
