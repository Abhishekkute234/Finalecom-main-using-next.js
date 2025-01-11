import Image from "next/image";
import Link from "next/link";
import React from "react";

const Collection = () => {
  return (
    <div className="collection-block md:pt-[60px] pt-10">
      <div className="container">
        <div className="heading flex items-center justify-between gap-5 flex-wrap">
          <div className="heading3">Our Collections</div>
          <Link
            href="/shop"
            className="text-button pb-0.5 border-b-2 border-black"
          >
            View All
          </Link>
        </div>
        <div className="list grid xl:grid-cols-4 sm:grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
          {/* Mirrorless Cameras */}
          <div className="item flex gap-3 px-5 py-6 border border-line rounded-2xl">
            <Link
              href="/shop"
              className="img-product w-[100px] h-[100px] flex-shrink-0"
            >
              <Image
                width={5000}
                height={5000}
                src="/images/collection/marketplace1.png"
                className="w-full h-full object-cover"
                alt="Mirrorless Camera"
              />
            </Link>
            <div className="text-content w-full">
              <div className="heading6 pb-4">Mirrorless Cameras</div>
              <ul>
                <li>
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Sony
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Nikon
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Canon
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Lumix
                  </Link>
                </li>
              </ul>
              <Link href="/shop" className="flex items-center gap-1.5 mt-4">
                <span className="text-button has-line-before ">All Cameras</span>
                <i className="ph-bold ph-caret-double-right text-sm"></i>
              </Link>
            </div>
          </div>
          {/* Camera Lenses */}
          <div className="item flex gap-3 px-5 py-6 border border-line rounded-2xl">
            <Link
              href="/shop"
              className="img-product w-[100px] h-[100px] flex-shrink-0"
            >
              <Image
                width={5000}
                height={5000}
                src="/images/collection/marketplace2.png"
                className="w-full h-full object-contain"
                alt="Camera Lenses"
              />
            </Link>
            <div className="text-content w-full">
              <div className="heading6 pb-4">Camera Lenses</div>
              <ul>
                <li>
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Wide Angle
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Zoom Lenses
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Prime Lenses
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Macro Lenses
                  </Link>
                </li>
              </ul>
              <Link href="/shop" className="flex items-center gap-1.5 mt-4">
                <span className="text-button has-line-before ">All Lenses</span>
                <i className="ph-bold ph-caret-double-right text-sm"></i>
              </Link>
            </div>
          </div>
          {/* Tripods */}
          <div className="item flex gap-3 px-5 py-6 border border-line rounded-2xl">
            <Link
              href="/shop"
              className="img-product w-[100px] h-[100px] flex-shrink-0"
            >
              <Image
                width={5000}
                height={5000}
                src="/images/collection/marketplace3.png"
                className="w-full h-full object-cover"
                alt="Tripods"
              />
            </Link>
            <div className="text-content w-full">
              <div className="heading6 pb-4">Tripods</div>
              <ul>
                <li>
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Travel Tripods
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Professional Tripods
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Flexible Tripods
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Mini Tripods
                  </Link>
                </li>
              </ul>
              <Link href="/shop" className="flex items-center gap-1.5 mt-4">
                <span className="text-button has-line-before ">All Tripods</span>
                <i className="ph-bold ph-caret-double-right text-sm"></i>
              </Link>
            </div>
          </div>
          {/* Camera Accessories */}
          <div className="item flex gap-3 px-5 py-6 border border-line rounded-2xl">
            <Link
              href="/shop"
              className="img-product w-[100px] h-[100px] flex-shrink-0"
            >
              <Image
                width={5000}
                height={5000}
                src="/images/collection/marketplace4.png"
                className="w-full h-full object-contain"
                alt="Camera Accessories"
              />
            </Link>
            <div className="text-content w-full">
              <div className="heading6 pb-4">Camera Accessories</div>
              <ul>
                <li>
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Batteries
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Chargers
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Straps
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    href="/shop"
                    className="has-line-before caption1 text-secondary hover:text-black"
                  >
                    Cleaning Kits
                  </Link>
                </li>
              </ul>
              <Link href="/shop" className="flex items-center gap-1.5 mt-4">
                <span className="text-button has-line-before ">All Accessories</span>
                <i className="ph-bold ph-caret-double-right text-sm"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
