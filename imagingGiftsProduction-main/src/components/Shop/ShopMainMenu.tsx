"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";

// Local state / context imports (adjust as needed)
import useLoginPopup from "@/store/useLoginPopup";
import useSubMenuDepartment from "@/store/useSubMenuDepartment";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

// 1) Put your category data here or import it from another file:
const CATEGORY_DATA: Record<string, Record<string, string[]>> = {
  Photography: {
    Cameras: [
      "DSLR Cameras",
      "Mirrorless Cameras",
      "Point-and-Shoot Cameras",
      "Action Cameras",
      "Film Cameras",
      "Instant Cameras",
      "360° Cameras",
      "Medium Format Cameras",
    ],
    Lenses: [
      "Prime Lenses",
      "Zoom Lenses",
      "Telephoto Lenses",
      "Wide-Angle Lenses",
      "Macro Lenses",
      "Fisheye Lenses",
      "Tilt-Shift Lenses",
      "Anamorphic Lenses",
      "Kit Lenses",
    ],
    "Tripods & Stabilizers": [
      "Monopods",
      "Gimbals",
      "Travel Tripods",
      "Heavy-Duty Tripods",
      "Carbon Fiber Tripods",
      "Tabletop Tripods",
    ],
    "Memory & Storage": [
      "SD Cards",
      "CF Cards",
      "XQD Cards",
      "External Hard Drives",
      "Portable SSDs",
      "MicroSD Cards",
      "Card Readers",
    ],
    "Camera Bags & Cases": [
      "Backpack Cases",
      "Hard Cases",
      "Sling Bags",
      "Messenger Bags",
      "Shoulder Bags",
      "Waterproof Cases",
    ],
    Drones: [
      "Consumer Drones",
      "Professional Drones",
      "FPV Drones",
      "Mini Drones",
      "Aerial Imaging Drones",
      "Drone Accessories",
    ],
    "Underwater Photography": [
      "Underwater Housings",
      "Waterproof Cameras",
      "Dive Lights",
      "Floating Hand Straps",
    ],
    "Remote & Wireless Controls": [
      "Wireless Shutter Remotes",
      "Intervalometers",
      "Smartphone Camera Controllers",
    ],
  },
  Videography: {
    Cameras: [
      "Cinema Cameras",
      "Camcorders",
      "Mirrorless (Video Kits)",
      "Broadcast Cameras",
      "Professional Video Cameras",
      "Pocket Cinema Cameras",
      "PTZ Cameras",
    ],
    "Video Lenses": [
      "Cinema Lenses",
      "Telephoto Video Lenses",
      "Wide-Angle Video Lenses",
      "Anamorphic Lenses",
    ],
    Rigs: [
      "Shoulder Rigs",
      "Cage Rigs",
      "Gimbal Rigs",
      "Modular Rigs",
      "Follow Focus Systems",
    ],
    Microphones: [
      "Shotgun Microphones",
      "Wireless Lavalier Microphones",
      "Boom Mics",
      "Stereo Microphones",
      "Handheld Mics",
    ],
    Recorders: [
      "Field Recorders",
      "Camera-Top Recorders",
      "Multitrack Recorders",
      "Audio Interfaces",
    ],
    Monitors: [
      "On-Camera Monitors",
      "Field Monitors",
      "Broadcast Monitors",
      "HDR Video Monitors",
    ],
    Accessories: ["Viewfinders", "Monitor Hoods", "Video Transmission Systems"],
  },
  Accessories: {
    Filters: [
      "UV Filters",
      "ND Filters",
      "Polarizing Filters",
      "Gradient Filters",
      "Special Effects Filters",
    ],
    "Battery & Power": [
      "Rechargeable Batteries",
      "Battery Grips",
      "Power Adapters",
      "Portable Power Stations",
      "V-Mount Batteries",
    ],
    "Cleaning & Maintenance": [
      "Lens Cleaners",
      "Sensor Cleaners",
      "Air Blowers",
      "Cleaning Kits",
      "Camera Dust Covers",
    ],
    Straps: ["Neck Straps", "Hand Straps", "Wrist Straps", "Chest Harnesses"],
    "Camera Remotes": [
      "Wireless Remotes",
      "Intervalometers",
      "Cable Releases",
      "Smartphone Control Adapters",
    ],
    Lighting: [
      "Ring Lights",
      "Portable LED Panels",
      "Continuous Lighting Kits",
      "RGB LED Lights",
      "Strobe Lights",
    ],
  },
  Lighting: {
    "Lighting Kits": [
      "Continuous Kits",
      "Strobe Kits",
      "LED Kits",
      "Portable Lighting Kits",
      "RGB Lighting Kits",
    ],
    "Flash & Speedlites": [
      "On-Camera Flashes",
      "Studio Strobes",
      "Ring Lights",
    ],
    "Light Modifiers": [
      "Softboxes",
      "Umbrellas",
      "Reflectors",
      "Snoots",
      "Grids",
      "Barn Doors",
    ],
    "Light Stands": [
      "C-Stands",
      "Compact Stands",
      "Heavy-Duty Stands",
      "Boom Arms",
      "Mini Stands",
    ],
    Backgrounds: [
      "Green Screens",
      "Vinyl Backgrounds",
      "Muslin Backgrounds",
      "Collapsible Backgrounds",
      "Paper Rolls",
    ],
  },
  "Editing & Post-Processing": {
    Software: [
      "Photo Editing Software",
      "Video Editing Software",
      "Color Grading Tools",
      "3D Modeling Tools",
    ],
    "Hardware & Peripherals": [
      "Graphics Tablets",
      "Color Calibration Tools",
      "Monitors",
      "Editing Keyboards",
      "Control Surfaces",
    ],
    Plugins: [
      "Photoshop Plugins",
      "Lightroom Presets",
      "Video LUTs",
      "After Effects Plugins",
    ],
    "External Storage": [
      "RAID Systems",
      "Portable SSD Drives",
      "NAS Solutions",
      "Memory Card Wallets",
    ],
  },
  "Photo Tripod & Supports": {
    Tripods: ["Tripod Leg", "Tripod with Head", "Carbon Fiber Tripods"],
    "Video Tripods": ["Fluid Heads", "Tripod Systems with Dollies"],
  },
  "Cables & Adapters": {
    "USB Cables": ["USB-A to C", "USB-C to C"],
    Adapters: ["HDMI Adapters", "Audio Cables", "Video Transmission Cables"],
  },
};

const ShopMainMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Replace with your actual store logic if needed
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openSubMenuDepartment } = useSubMenuDepartment();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const { openModalCart } = useModalCartContext();
  const { cartState } = useCart();
  const { openModalWishlist } = useModalWishlistContext();

  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Sign-out
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  // Simple search
  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${encodeURIComponent(value)}`);
    setSearchKeyword("");
  };

  // Toggle sub-menu in Mobile
  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const closeMenuMobile = () => {
    if (openMenuMobile) {
      handleMenuMobile(); // toggles it off
    }
  };

  /**
   * Universal route handler for categories:
   *   - main => ?category=...
   *   - sub  => ?subcategory=...
   *   - subSub => ?subSubCategory=...
   */
  const handleCategoryRoute = (main: string, sub?: string, subSub?: string) => {
    // e.g. /shop?category=Photography&subcategory=Cameras&subSubCategory=Instant%20Cameras
    let url = `/shop?category=${encodeURIComponent(main)}`;
    if (sub) url += `&subcategory=${encodeURIComponent(sub)}`;
    if (subSub) url += `&subSubCategory=${encodeURIComponent(subSub)}`;
    router.push(url);

    // Close mobile menu
    closeMenuMobile();

    // Close desktop mega menu
    setOpenDesktopMenu(null);
  };

  return (
    <>
      {/* 1) HEADER NAVBAR */}
      <div className="header-menu bg-white w-full top-0 z-10 duration-500">
        <div className="header-menu-main style-marketplace relative bg-[#263587] w-full md:h-[74px] h-[56px]">
          <div className="container mx-auto h-full">
            <div className="header-main flex items-center justify-between h-full">
              {/* Mobile Icon */}
              <div
                className="menu-mobile-icon lg:hidden flex items-center"
                onClick={handleMenuMobile}
              >
                <Icon.List className="text-white text-2xl" />
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="heading4 text-white">ImagingGifts</div>
              </Link>

              {/* Desktop Search Bar */}
              <div className="form-search w-2/3 pl-8 flex items-center h-[44px] max-lg:hidden">
                <div className="w-full flex items-center h-full">
                  <input
                    className="search-input h-full px-4 w-full border border-line rounded-l"
                    placeholder="What are you looking for today?"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearch(searchKeyword)
                    }
                  />
                  <button
                    className="search-button button-main bg-red text-white h-full flex items-center px-7 rounded-none rounded-r"
                    onClick={() => handleSearch(searchKeyword)}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="right flex gap-12">
                <div className="list-action flex items-center gap-4">
                  {session ? (
                    <div className="user-icon flex items-center justify-center cursor-pointer">
                      <Icon.User
                        weight="bold"
                        size={24}
                        color="white"
                        onClick={handleLoginPopup}
                      />
                      <div
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${
                          openLoginPopup ? "open" : ""
                        }`}
                      >
                        <Link
                          href={"/profile"}
                          className="button-main w-full text-center"
                        >
                          <span>{session.user?.name}</span>
                        </Link>
                        <div className="text-secondary text-center mt-3 pb-4">
                          <Link
                            href={"/register"}
                            className="mt-2 px-4 py-2 bg-red rounded-lg text-white font-semibold"
                            onClick={() => handleSignOut()}
                          >
                            Logout
                          </Link>
                        </div>
                        <div className="bottom pt-4 border-t border-line"></div>
                        <Link href={"#!"} className="body1 hover:underline">
                          Support
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="user-icon flex items-center justify-center cursor-pointer">
                      <Icon.User
                        weight="bold"
                        size={24}
                        color="white"
                        onClick={handleLoginPopup}
                      />
                      <div
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${
                          openLoginPopup ? "open" : ""
                        }`}
                      >
                        <Link
                          href={"/login"}
                          className="button-main w-full text-center"
                        >
                          Login
                        </Link>
                        <div className="text-secondary text-center mt-3 pb-4">
                          Don’t have an account?
                          <Link
                            href={"/register"}
                            className="text-black pl-1 hover:underline"
                          >
                            Register
                          </Link>
                        </div>
                        <div className="bottom pt-4 border-t border-line"></div>
                        <Link href={"#!"} className="body1 hover:underline">
                          Support
                        </Link>
                      </div>
                    </div>
                  )}
                  <div
                    className="max-md:hidden wishlist-icon flex items-center cursor-pointer"
                    onClick={openModalWishlist}
                  >
                    <Icon.Heart weight="bold" size={24} color="white" />
                  </div>
                  <div
                    className="cart-icon flex items-center relative cursor-pointer"
                    onClick={openModalCart}
                  >
                    <Icon.Handbag weight="bold" size={24} color="white" />
                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-red w-4 h-4 flex items-center justify-center rounded-full">
                      {cartState.cartArray.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2) DESKTOP MEGA MENU */}
        <div className="top-nav-menu relative bg-white border-b border-line h-[44px] max-lg:hidden z-10">
          <div className="container h-full">
            <div className="top-nav-menu-main h-full">
              <div className="h-full">
                <div className="menu-main style-eight h-full max-lg:hidden">
                  <ul className="flex  items-center gap-8 justify-between h-full">
                    {Object.entries(CATEGORY_DATA).map(
                      ([mainCategory, subCategories], index) => (
                        <li
                          key={mainCategory}
                          onMouseEnter={() => setOpenDesktopMenu(mainCategory)}
                          className="h-full "
                        >
                          {/* Top-level link (main category) */}
                          <Link
                            href="#!"
                            className="text-button-uppercase  duration-300 h-full flex items-center justify-center"
                          >
                            {mainCategory}
                          </Link>

                          {/* Mega Menu Dropdown */}

                          {openDesktopMenu === mainCategory && (
                            <div className=" mega-menu absolute top-[44px]  left-0 bg-white w-screen">
                              <div className="container ">
                                <div className="flex justify-between py-8">
                                  {/* Left side: sub categories */}
                                  <div className="nav-link  basis-2/3 grid grid-cols-4 gap-y-8">
                                    {Object.entries(subCategories).map(
                                      ([subCategory, subSubArray]) => (
                                        <div
                                          className="nav-item"
                                          key={subCategory}
                                        >
                                          <div className="text-button-uppercase pb-2">
                                            {subCategory}
                                          </div>
                                          <ul>
                                            {subSubArray.map((subSubItem) => (
                                              <li key={subSubItem}>
                                                <div
                                                  onClick={() =>
                                                    handleCategoryRoute(
                                                      mainCategory,
                                                      subCategory,
                                                      subSubItem
                                                    )
                                                  }
                                                  className="link text-secondary duration-300 cursor-pointer"
                                                >
                                                  {subSubItem}
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )
                                    )}
                                  </div>

                                  {/* Right side: banner or ads (you can keep or change this as needed) */}
                                  <div className="banner-ads-block pl-2.5 basis-1/3">
                                    <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer">
                                      <Image
                                        src={
                                          "/images/other/bg-feature-organic.png"
                                        }
                                        width={1000}
                                        height={800}
                                        alt="bg-img"
                                        className="absolute left-0 top-0 w-full h-full object-cover"
                                      />
                                      <div className="text-content py-14 pl-8 relative z-[1] text-white">
                                        <div className="text-button-uppercase bg-red px-2 py-0.5 inline-block rounded-sm">
                                          Save $10
                                        </div>
                                        <div className="heading6 mt-2">
                                          Dive into Savings
                                        </div>
                                        <div className="body1 mt-3 text-secondary">
                                          Starting at{" "}
                                          <span className="text-red">
                                            $59.99
                                          </span>
                                        </div>
                                        <div className="button-main mt-5">
                                          Shop Now
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* end right side */}
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end HEADER NAVBAR */}

      {/* 3) MOBILE MENU */}
      <div id="menu-mobile" className={openMenuMobile ? "open" : ""}>
        <div className="menu-container bg-white h-full">
          <div className="container h-full">
            <div className="menu-main h-full overflow-hidden">
              {/* Mobile Header */}
              <div className="heading py-2 relative flex items-center justify-center">
                <div
                  className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                  onClick={handleMenuMobile}
                >
                  <Icon.X size={14} />
                </div>
                <Link
                  href="/"
                  className="logo text-3xl font-semibold text-center"
                >
                  ImagingGifts
                </Link>
              </div>

              {/* Mobile Search */}
              <div className="form-search relative mt-2 px-4">
                <Icon.MagnifyingGlass
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer"
                />
                <input
                  placeholder="What are you looking for?"
                  className="h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchKeyword)
                  }
                />
              </div>

              {/* Mobile Nav List */}
              <div className="list-nav mt-6 px-4">
                <ul>
                  {Object.entries(CATEGORY_DATA).map(
                    ([mainCategory, subCategories], index) => (
                      <li
                        key={mainCategory}
                        className={`${
                          openSubNavMobile === index ? "open" : ""
                        } mt-4`}
                      >
                        {/* Toggle Main Category */}
                        <div
                          className="text-xl font-semibold flex items-center justify-between cursor-pointer"
                          onClick={() => handleOpenSubNavMobile(index)}
                        >
                          {mainCategory}
                          <Icon.CaretRight size={20} />
                        </div>

                        {/* Sub-Menu Mobile */}
                        {openSubNavMobile === index && (
                          <div className="sub-nav-mobile">
                            <div
                              className="back-btn flex items-center gap-3 mt-2 mb-4 cursor-pointer"
                              onClick={() => handleOpenSubNavMobile(index)}
                            >
                              <Icon.CaretLeft />
                              <span>Back</span>
                            </div>
                            <div className="list-nav-item w-full grid grid-cols-2 gap-4 pb-4">
                              {/* For each subCategory */}
                              {Object.entries(subCategories).map(
                                ([subCategory, subSubArray]) => (
                                  <ul key={subCategory}>
                                    <li>
                                      <div className="font-semibold mb-2">
                                        {subCategory}
                                      </div>
                                    </li>
                                    {subSubArray.map((item) => (
                                      <li key={item}>
                                        <div
                                          onClick={() =>
                                            handleCategoryRoute(
                                              mainCategory,
                                              subCategory,
                                              item
                                            )
                                          }
                                          className="nav-item-mobile text-secondary duration-300 cursor-pointer"
                                        >
                                          {item}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopMainMenu;
