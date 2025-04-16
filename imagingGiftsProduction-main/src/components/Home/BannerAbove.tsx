import Image from "next/image";
import Link from "next/link";
import React from "react";

const BannerAbove = () => {
  return (
    <div className="banner-block py-10 bg-gradient-to-b  to-white rounded-lg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 lg:gap-8 gap-6">
          {/* Banner 1 */}
          <Link
            href="/shop"
            className="banner-item relative bg-teal-500 hover:bg-teal-600 transition-all duration-500 rounded-xl overflow-hidden shadow-md flex items-center justify-between px-8 py-10"
          >
            <div className="banner-content">
              <h3 className="text-2xl font-bold text-white leading-tight">
                Camera <br /> Save Up To  ₹14,000  
              </h3>
              <span className="inline-block mt-4 text-sm font-medium text-white border-b-2 border-white">Shop Camera</span>
            </div>
            <div className="banner-img w-40 h-40 relative">
              <Image
                src="/images/banner/marketplace.png"
                alt="Camera Banner"
                layout="fill"
                objectFit="contain"
                className="duration-500"
              />
            </div>
          </Link>

          {/* Banner 2 */}
          <Link
            href="/shop"
            className="banner-item relative bg-indigo-500 hover:bg-indigo-600 transition-all duration-500 rounded-xl overflow-hidden shadow-md flex items-center justify-between px-8 py-10"
          >
            <div className="banner-content">
              <h3 className="text-2xl font-bold text-white leading-tight">
                Speaker <br /> Save Up To  ₹6,900
              </h3>
              <span className="inline-block mt-4 text-sm font-medium text-white border-b-2 border-white">Shop Speaker</span>
            </div>
            <div className="banner-img w-40 h-40 relative">
              <Image
                src="/images/banner/marketplace2.png"
                alt="Speaker Banner"
                layout="fill"
                objectFit="contain"
                className="duration-500"
              />
            </div>
          </Link>

          {/* Banner 3 */}
          <Link
            href="/shop"
            className="banner-item relative bg-rose-500 hover:bg-rose-600 transition-all duration-500 rounded-xl overflow-hidden shadow-md flex items-center justify-between px-8 py-10"
          >
            <div className="banner-content">
              <h3 className="text-2xl font-bold text-white leading-tight">
                Cameras <br /> Save Up To  ₹1690
              </h3>
              <span className="inline-block mt-4 text-sm font-medium text-white border-b-2 border-white">Shop Deals</span>
            </div>
            <div className="banner-img w-40 h-40 relative">
              <Image
                src="/images/banner/marketplace3.png"
                alt="Cameras Banner"
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

export default BannerAbove;
