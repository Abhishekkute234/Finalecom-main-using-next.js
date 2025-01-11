"use client";

import React, { useState, useEffect } from "react";

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
import { useRouter } from "next/navigation";

interface SideMenuProps {
  className?: string;
}

const categories = [
  { name: "Photography", icon: <PiGooglePhotosLogoThin />, href: "/shop" },
  { name: "Videography", icon: <CiVideoOn />, href: "/shop" },
  { name: "Drones", icon: <PiDroneThin />, href: "/shop" },
  { name: "Audio", icon: <BsSoundwave />, href: "/shop" },
  {
    name: "Bags & Cases",
    icon: <PiHandbagSimpleThin />,
    href: "/shop/breadcrumb-img",
  },
  {
    name: "Tripods",
    icon: <PiBabyCarriageThin />,
    href: "/shop/breadcrumb-img",
  },
  { name: "Lights", icon: <TfiLightBulb />, href: "/shop" },
  {
    name: "Computers",
    icon: <PiComputerTowerThin />,
    href: "/shop/breadcrumb-img",
  },
  {
    name: "Headphones",
    icon: <PiHeadphonesThin />,
    href: "/shop/breadcrumb-img",
  },
];

const SideMenu: React.FC<SideMenuProps> = ({ className }) => {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCategoryClick = (categoryName: string, href: string) => {
    if (!isMounted) return;
    setLoadingCategory(categoryName);
    setTimeout(() => {
      setLoadingCategory(null);
      router.push(href);
    }, 300);
  };

  return (
    <div
      className={`relative h-full border border-[#E9E9E9] mt-10 rounded-xl ${className}`}
    >
      <div className="menu-department-btn relative flex items-center sm:gap-24 gap-4 h-full w-fit">
        {/* Additional content if needed */}
      </div>
      <div className="sub-menu-department style-marketplace px-6 py-2 bg-black rounded-xl border border-line">
        {categories.map((category) => (
          <button
            key={category.name}
            className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between "
            onClick={() => handleCategoryClick(category.name, category.href)}
          >
            <span className="flex items-center gap-2">
              {category.icon}
              <span className="name">{category.name}</span>
            </span>
            {loadingCategory === category.name ? (
              <span className=" ml-2 w-4 h-4 border-2 border-t-transparent border-[#C7C7C7] rounded-full animate-spin"></span>
            ) : (
            <div className=" ml-2">

              <SlArrowRight size={12} />
            </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
