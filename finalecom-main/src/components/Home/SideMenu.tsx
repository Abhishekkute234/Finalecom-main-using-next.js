import React from "react";
import Link from "next/link";
import { FaBeer } from "react-icons/fa";
import {
  PiBabyCarriageThin,
  PiComputerTowerThin,
  PiGooglePhotosLogoThin,
  PiHeadphonesThin,
} from "react-icons/pi";
import { CiVideoOn } from "react-icons/ci";
import { PiDroneThin } from "react-icons/pi";
import { BsSoundwave } from "react-icons/bs";
import { PiHandbagSimpleThin } from "react-icons/pi";
import { SlArrowRight } from "react-icons/sl";
import { TfiLightBulb } from "react-icons/tfi";

const SideMenu = () => {
  return (
    <div className="relative h-full border  border-[#E9E9E9] mt-10 rounded-xl">
      <div className="menu-department-btn relative flex items-center sm:gap-24 gap-4 h-full w-fit">
        {/* You can add other content here if needed */}
      </div>
      <div className="sub-menu-department style-marketplace px-[26px] py-[5px] bg-black rounded-xl border border-line">
        <Link
          href="/shop"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <PiGooglePhotosLogoThin />
            <span className="name">Photography</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <CiVideoOn />
            <span className="name">Videography</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <PiDroneThin />
            <span className="name">Drones</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop/breadcrumb-img"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <BsSoundwave />
            <span className="name">Audio</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop/breadcrumb-img"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <PiHandbagSimpleThin />
          <span className="flex items-center px-2">
            <span className="name">Bags & Cases</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop/breadcrumb-img"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <PiBabyCarriageThin />
            <span className="name">Tripods</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <TfiLightBulb />
            <span className="name">Lights</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop/breadcrumb-img"
          className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <PiComputerTowerThin />
            <span className="name">Computers</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
        <Link
          href="/shop/breadcrumb-img"
          className="item py-3 whitespace-nowrap w-full flex items-center justify-between"
        >
          <span className="flex items-center  gap-2">
            <PiHeadphonesThin />
            <span className="name">Headphones</span>
          </span>
          <SlArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default SideMenu;
