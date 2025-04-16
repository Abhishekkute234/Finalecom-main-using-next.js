"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSession, signOut } from "next-auth/react";

// Local state / context imports
import useLoginPopup from "@/store/useLoginPopup";
import useSubMenuDepartment from "@/store/useSubMenuDepartment";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCart } from "@/context/CartsContext";

// Category data moved outside component to prevent recreation on each render
const CATEGORY_DATA = {
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

  // Store hooks
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openSubMenuDepartment } = useSubMenuDepartment();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const { openModalCart } = useModalCartContext();
  const { cart } = useCart();
  const { openModalWishlist } = useModalWishlistContext();

  // State management
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
  }, [router]);

  const handleSearch = useCallback((value: string) => {
    router.push(`/search-result?query=${encodeURIComponent(value)}`);
    setSearchKeyword("");
  }, [router]);

  const closeMenuMobile = useCallback(() => {
    if (openMenuMobile) {
      handleMenuMobile();
    }
  }, [openMenuMobile, handleMenuMobile]);

  const handleCategoryRoute = useCallback((main: string, sub?: string, subSub?: string) => {
    let url = `/shop?category=${encodeURIComponent(main)}`;
    if (sub) url += `&subcategory=${encodeURIComponent(sub)}`;
    if (subSub) url += `&subSubCategory=${encodeURIComponent(subSub)}`;
    router.push(url);
    closeMenuMobile();
    setOpenDesktopMenu(null);
  }, [router, closeMenuMobile]);

  const handleOpenSubNavMobile = useCallback((index: number) => {
    setOpenSubNavMobile(prevState => prevState === index ? null : index);
  }, []);

  // Memoize desktop menu content to prevent unnecessary re-renders
  const desktopMenuContent = useMemo(() => (
    Object.entries(CATEGORY_DATA).map(
      ([mainCategory, subCategories]) => (
        <li
          key={mainCategory}
          onMouseEnter={() => setOpenDesktopMenu(mainCategory)}
          onMouseLeave={() => setOpenDesktopMenu(null)}
          className="h-full"
        >
          <Link
            href="#!"
            className="text-button-uppercase duration-300 h-full flex items-center justify-center"
          >
            {mainCategory}
          </Link>

          <div
            className={`mega-menu absolute top-full left-0 bg-white w-full transition-all duration-300 ease-in-out transform ${
              openDesktopMenu === mainCategory
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="container">
              <div className="flex justify-between py-8">
                <div className="nav-link basis-2/3 grid grid-cols-4 gap-y-8">
                  {Object.entries(subCategories).map(
                    ([subCategory, subSubArray]) => (
                      <div className="nav-item" key={subCategory}>
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
                                className="link text-secondary duration-300 cursor-pointer hover:text-red-500"
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

                <div className="banner-ads-block pl-2.5 basis-1/3">
                  <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer">
                    <Image
                      src="/images/banner/marketplace2.jpeg"
                      width={1000}
                      height={800}
                      alt="bg-img"
                      className="absolute left-0 top-0 w-full h-full object-cover"
                    />
                    <div className="text-content py-14 pl-8 relative z-10 text-white">
                      <div className="text-button-uppercase bg-red-500 px-2 py-0.5 inline-block rounded-sm">
                        Save  ₹700
                      </div>
                      <div className="heading6 mt-2">
                        Dive into Savings
                      </div>
                      <div className="body1 mt-3 text-secondary">
                        Starting at{' '}
                        <span className="text-red-500"> ₹ 4500</span>
                      </div>
                      <div className="button-main mt-5">
                        Shop Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      )
    )
  ), [openDesktopMenu, handleCategoryRoute]);

  return (
    <>
      <div className="header-menu bg-white w-full top-0 z-10 duration-500">
        <div className="header-menu-main style-marketplace relative bg-[#263587] w-full md:h-[74px] h-[56px]">
          <div className="container mx-auto h-full">
            <div className="header-main flex items-center justify-between h-full">
              <div
                className="menu-mobile-icon lg:hidden flex items-center"
                onClick={handleMenuMobile}
              >
                <Icon.List className="text-white text-2xl" />
              </div>

              <Link href="/" className="flex items-center">
                <div className="heading4 text-white">ImagingGifts</div>
              </Link>

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
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${openLoginPopup ? "open" : ""
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
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${openLoginPopup ? "open" : ""
                          }`}
                      >
                        <Link
                          href={"/login"}
                          className="button-main w-full text-center"
                        >
                          Login
                        </Link>
                        <div className="text-secondary text-center mt-3 pb-4">
                          Dont have an account?
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
                      {cart.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-nav-menu relative bg-white border-b border-line h-[44px] max-lg:hidden z-10">
          <div className="container h-full">
            <div className="top-nav-menu-main h-full">
              <div className="h-full">
                <div className="menu-main style-eight h-full max-lg:hidden">
                  <ul className="flex items-center gap-8 justify-between h-full">
                    {desktopMenuContent}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="menu-mobile" className={`menu-mobile ${openMenuMobile ? "open" : ""}`}>
        <div className="menu-container bg-white h-full overflow-y-auto">
          <div className="container h-full flex flex-col">
            <div className="header py-4 px-6 flex items-center justify-between border-b border-gray-200">
              <button
                className="close-menu-btn text-gray-600 hover:text-black transition duration-300"
                onClick={handleMenuMobile}
              >
                Close
              </button>
              <h1 className="text-xl font-bold text-center">ImagingGifts</h1>
              <div></div>
            </div>

            <div className="search-section mt-4 px-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition duration-300"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(searchKeyword)}
                />
                <div 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => handleSearch(searchKeyword)}
                >
                  Search
                </div>
              </div>
            </div>

            <div className="navigation mt-6 flex-1 overflow-y-auto">
              <ul className="px-6 space-y-4">
                {Object.entries(CATEGORY_DATA).map(([mainCategory, subCategories], index) => (
                  <li key={mainCategory} className="category-item">
                    <div
                      className="main-category flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer transition duration-300 hover:bg-gray-50"
                      onClick={() => handleOpenSubNavMobile(index)}
                    >
                      <span className="text-lg font-medium">{mainCategory}</span>
                      <span className="text-gray-500">+</span>
                    </div>

                    {openSubNavMobile === index && (
                      <div className="sub-menu mt-4 space-y-4">
                        <div
                          className="back-btn flex items-center gap-2 text-gray-600 cursor-pointer hover:text-black transition duration-300"
                          onClick={() => handleOpenSubNavMobile(index)}
                        >
                          <span>Back</span>
                        </div>

                        {Object.entries(subCategories).map(([subCategory, subSubArray]) => (
                          <div key={subCategory} className="sub-category">
                            <h3 className="font-semibold text-gray-800 mb-2">{subCategory}</h3>
                            <ul className="space-y-2">
                              {subSubArray.map((item) => (
                                <li key={item}>
                                  <div
                                    onClick={() => handleCategoryRoute(mainCategory, subCategory, item)}
                                    className="nav-item text-gray-700 hover:text-primary transition duration-300 cursor-pointer"
                                  >
                                    {item}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Use React.memo to prevent unnecessary re-renders of the whole component
export default React.memo(ShopMainMenu);
