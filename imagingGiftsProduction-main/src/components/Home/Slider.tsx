import Image from "next/image";
import React from "react";

import SideMenu from "@/components/Home/SideMenu";
import Link from "next/link";

const SliderMarketplace = () => {
  return (
    <>
      <div className="flex h-full container">
        {/* Hide the SideMenu on mobile and tablet, show on larger screens */}

        <SideMenu className="hidden lg:block " />
        <div className="style-marketplace lg:h-[500px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
          <div className="container pt-10 flex justify-end h-full w-full">
            <div className="slider-main lg:pl-5 h-full w-full">
              <div className="h-full relative rounded-2xl overflow-hidden">
                <div className="slider-item h-full w-full flex items-center bg-surface relative">
                  <div className="text-content md:pl-16 pl-5 basis-1/2 relative z-[1]">
                    <div className="text-sub-display text-white">
                      <h3 className="text-2xl md:text-4xl font-bold leading-tight">
                        BEST SELLING
                      </h3>
                      <p className="mt-4 md:mt-6 text-lg md:text-2xl font-semibold">
                        Step Into New Worlds
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-block bg-white text-blue-700 font-medium px-6 py-3 rounded-lg mt-6 hover:bg-gray-100 transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="sub-img absolute top-0 left-0 w-full h-full">
                    <Image
                      src="/images/slider/marketplace1.png"
                      width={5000}
                      height={5000}
                      alt="marketplace"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderMarketplace;
