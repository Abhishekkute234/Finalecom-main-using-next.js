import Image from "next/image";
import Link from "next/link";
import React from "react";

const BannerBelow = () => {
  return (
    <div className="banner-block md:pt-[60px] pt-8">
      <div className="container">
        <div className="list-banner grid sm:grid-cols-2 lg:gap-[30px] gap-[20px]">
          {/* Banner 1: Camera Sale */}
          <Link
            href="/shop"
            className="banner-item relative py-[53.5px] px-10 bg-[#848EFF] block duration-500 rounded-2xl overflow-hidden"
          >
            <div className="banner-img w-[173px] absolute top-1/2 -translate-y-1/2 right-14">
              <Image
                width={10000}
                height={10000}
                src="/images/banner/camera-sale.png"
                className="w-full duration-500"
                alt="Camera Sale"
              />
            </div>
            <div className="banner-content relative">
              <div className="heading5 text-white">
                Super Sale <br /> Mirrorless Cameras
              </div>
              <div className="text-title text-white mt-2">Save $499.00</div>
              <div className="text-button text-white relative inline-block pb-1 border-b-2 border-white duration-500 mt-2">
                Shop Now
              </div>
            </div>
          </Link>
          {/* Banner 2: Accessories Discount */}
          <Link
            href="/shop"
            className="banner-item relative py-[53.5px] px-10 bg-[#E7514A] block duration-500 rounded-2xl overflow-hidden"
          >
            <div className="banner-img w-1/2 absolute top-1/2 -translate-y-1/2 right-10">
              <Image
                width={5000}
                height={5000}
                src="/images/banner/accessories-discount.png"
                className="w-full duration-500"
                alt="Camera Accessories Discount"
              />
            </div>
            <div className="banner-content relative">
              <div className="heading5 text-white">
                Deals On <br /> Camera Accessories
              </div>
              <div className="text-title text-white mt-2">Up to 30% Off</div>
              <div className="text-button text-white relative inline-block pb-1 border-b-2 border-white duration-500 mt-2">
                Shop Now
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBelow;
