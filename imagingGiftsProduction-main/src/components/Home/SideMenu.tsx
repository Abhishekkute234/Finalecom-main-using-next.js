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
  { name: "Photography", names: "Photography", icon: <PiGooglePhotosLogoThin />, href: "/shop" },
  { name: "Videography", names: "Videography", icon: <CiVideoOn />, href: "/shop" },
  { name: "Accessories", names: "Accessories", icon: <PiDroneThin />, href: "/shop" },
  { name: "Lighting", names: "Lighting", icon: <BsSoundwave />, href: "/shop" },
  {
    name: "Drones",
    names: "Drones",
    icon: <PiHandbagSimpleThin />,
    main: "Photography",
    href: "/shop",
    isSubCategory: true, // Mark this as a subcategory
  },
  {
    name: "Tripods",
    names: "Photo Tripod & Supports",
    icon: <PiBabyCarriageThin />,
    href: "/shop",
  },
  { name: "Battery", names: "Battery & Power", main: "Accessories", isSubCategory: true, icon: <TfiLightBulb />, href: "/shop" },
  {
    name: "Adapters",
    names: "Cables & Adapters",
    icon: <PiComputerTowerThin />,
    href: "/shop",
  },
  {
    name: "Memory Cards",
    names: "Memory & Storage",
    isSubCategory: true, 
    main: "Photography",
    icon: <PiHeadphonesThin />,
    href: "/shop",
  },
];

const SideMenu: React.FC<SideMenuProps> = ({ className }) => {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCategoryRoute = (main: string, sub?: string, subSub?: string) => {
    // Determine the base category or subcategory
    let url = `/shop?category=${encodeURIComponent(main)}`;
    if (sub) url += `&subcategory=${encodeURIComponent(sub)}`;
    if (subSub) url += `&subSubCategory=${encodeURIComponent(subSub)}`;

    // Redirect to the dynamically constructed URL
    router.push(url);
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
            className="item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between"
            onClick={() =>
              category.isSubCategory
                ? handleCategoryRoute(category.main, category.names) // Pass the subcategory
                : handleCategoryRoute(category?.names) // Pass only the main category
            }
          >
            <span className="flex items-center gap-2">
              {category.icon}
              <span className="name">{category.name}</span>
            </span>
            {loadingCategory === category.name ? (
              <span className="ml-2 w-4 h-4 border-2 border-t-transparent border-[#C7C7C7] rounded-full animate-spin"></span>
            ) : (
              <div className="ml-2">
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
