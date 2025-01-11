// components/Shop/ShopBreadCrumb1.tsx

"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
} from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import { ProductType } from "@/type/ProductType";
import Product from "../Product/Product";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import HandlePagination from "../Other/HandlePagination";
import useDebounce from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

interface ApiResponse {
  success: boolean;
  data: ProductType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface QueryParams {
  category?: string;
  subcategory?: string;
  subSubCategory?: string;
  sale?: boolean;
  type?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortField?: string;
  sortOrder?: string;
  page: number;
  limit: number;
}

const ShopBreadCrumb1: React.FC = () => {
  // Initialize useSearchParams to access URL query parameters
  const searchParams = useSearchParams();

  // Initialize a state to track if filters are set from URL
  const [isFiltersSet, setIsFiltersSet] = useState(false);

  // Category States
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedSubSub, setSelectedSubSub] = useState<string | null>(null);

  // Other Filter States
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [brand, setBrand] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000, // Align with slider's max
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for submitted search

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data States
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced Inputs
  const debouncedPriceRange = useDebounce(priceRange, 500); // 500ms debounce

  // CATEGORY_DATA as provided
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

  /**
   * **Effect to Parse and Set State Based on Query Parameters**
   * - This effect runs whenever the URL's search parameters change.
   * - It decodes and validates the `category`, `subcategory`, and `subSubCategory`.
   * - Sets the corresponding state variables if they exist in `CATEGORY_DATA`.
   */
  useEffect(() => {
    if (!searchParams) return; // Ensure searchParams are available

    // Extract and decode query parameters
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const subSubCategory = searchParams.get("subSubCategory");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    // Parse prices
    const minPrice = minPriceParam ? parseInt(minPriceParam, 10) : 0;
    const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : 100000;

    // Initialize temporary variables to hold the selected categories
    let newSelectedMain: string | null = null;
    let newSelectedSub: string | null = null;
    let newSelectedSubSub: string | null = null;

    // Validate and set selectedMain
    if (category && CATEGORY_DATA.hasOwnProperty(category)) {
      newSelectedMain = category;
    } else if (category) {
      console.warn(`Category "${category}" not found in CATEGORY_DATA.`);
    }

    // Validate and set selectedSub
    if (
      subcategory &&
      newSelectedMain &&
      CATEGORY_DATA[newSelectedMain].hasOwnProperty(subcategory)
    ) {
      newSelectedSub = subcategory;
    } else if (subcategory) {
      console.warn(
        `Subcategory "${subcategory}" not found under "${newSelectedMain}".`
      );
    }

    // Validate and set selectedSubSub
    if (
      subSubCategory &&
      newSelectedMain &&
      newSelectedSub &&
      CATEGORY_DATA[newSelectedMain][newSelectedSub].includes(subSubCategory)
    ) {
      newSelectedSubSub = subSubCategory;
    } else if (subSubCategory) {
      console.warn(
        `SubSubCategory "${subSubCategory}" not found under "${newSelectedSub}".`
      );
    }

    // Update state variables
    setSelectedMain(newSelectedMain);
    setSelectedSub(newSelectedSub);
    setSelectedSubSub(newSelectedSubSub);

    // Update price range
    setPriceRange({ min: minPrice, max: maxPrice });

    // Mark filters as set
    setIsFiltersSet(true);
  }, [searchParams]);

  /**
   * **Function to Build Query Parameters for API Request**
   * - Constructs the `QueryParams` object based on current state.
   */
  const buildQueryParams = useCallback((): QueryParams => {
    const params: QueryParams = {
      page: currentPage,
      limit: 9, // Products per page
    };

    // Categories
    if (selectedMain) params.category = selectedMain;
    if (selectedSub) params.subcategory = selectedSub;
    if (selectedSubSub) params.subSubCategory = selectedSubSub;

    // Show only sale
    if (showOnlySale) params.sale = true;

    // Type
    if (type) params.type = type;

    // Brand
    if (brand) params.brand = brand;

    // Search Term
    if (searchQuery.trim() !== "") params.search = searchQuery.trim();

    // Price Range (use debounced values)
    if (debouncedPriceRange.min !== 0)
      params.minPrice = debouncedPriceRange.min;
    if (debouncedPriceRange.max !== 100000)
      params.maxPrice = debouncedPriceRange.max;

    // Sorting
    if (sortOption) {
      switch (sortOption) {
        case "bestSelling":
          params.sortField = "soldQuantity";
          params.sortOrder = "desc";
          break;
        case "bestDiscount":
          params.sortField = "discount"; // Ensure backend can handle 'discount' field
          params.sortOrder = "desc";
          break;
        case "priceHighToLow":
          params.sortField = "priceDetails.offerPrice";
          params.sortOrder = "desc";
          break;
        case "priceLowToHigh":
          params.sortField = "priceDetails.offerPrice";
          params.sortOrder = "asc";
          break;
        default:
          break;
      }
    }

    return params;
  }, [
    selectedMain,
    selectedSub,
    selectedSubSub,
    showOnlySale,
    type,
    brand,
    searchQuery,
    debouncedPriceRange,
    sortOption,
    currentPage,
  ]);

  /**
   * **Fetch Products from Backend**
   * - Makes an Axios GET request to fetch products based on the built query parameters.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = buildQueryParams();

      console.log("Fetching products with params:", params); // Debugging

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      // Corrected Axios GET request without redundant '?limit=9'
      const fetchPromise = axios.get<ApiResponse>(`${baseUrl}/api/products?limit=9`, {
        params,
      });

      // Optional delay for demonstration or debouncing
      // Removed the delay as it's unnecessary
      const response = await fetchPromise;

      console.log("API Response:", response.data); // Debugging

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalProducts(response.data.pagination.total);
        setPageCount(response.data.pagination.pages);
      } else {
        setError("Failed to fetch products.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  /**
   * **Effect to Fetch Products When Dependencies Change**
   * - Triggers `fetchProducts` whenever filters, sorting, pagination, or search queries change.
   */
  useEffect(() => {
    if (isFiltersSet) {
      fetchProducts();
    }
  }, [fetchProducts, isFiltersSet]);

  /**
   * **Handlers for Category Selection**
   * - Manage user interactions with category filters.
   */
  const handleMainSelect = useCallback(
    (mainCategory: string) => {
      if (selectedMain === mainCategory) {
        setSelectedMain(null);
        setSelectedSub(null);
        setSelectedSubSub(null);
      } else {
        setSelectedMain(mainCategory);
        setSelectedSub(null);
        setSelectedSubSub(null);
      }
      setCurrentPage(1); // Reset to first page
    },
    [selectedMain]
  );

  const handleSubSelect = useCallback(
    (subCategory: string) => {
      if (selectedSub === subCategory) {
        setSelectedSub(null);
        setSelectedSubSub(null);
      } else {
        setSelectedSub(subCategory);
        setSelectedSubSub(null);
      }
      setCurrentPage(1); // Reset to first page
    },
    [selectedSub]
  );

  const handleSubSubSelect = useCallback(
    (subSubCategory: string) => {
      if (selectedSubSub === subSubCategory) {
        setSelectedSubSub(null);
      } else {
        setSelectedSubSub(subSubCategory);
      }
      setCurrentPage(1); // Reset to first page
    },
    [selectedSubSub]
  );

  /**
   * **Handlers for Other Filters**
   * - Manage user interactions with additional filters like sale items, sorting, brand, type, and price range.
   */
  const handleShowOnlySale = useCallback(() => {
    setShowOnlySale((prev) => !prev);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
    setCurrentPage(1);
  }, []);

  const handleTypeChange = useCallback((selected: string | null) => {
    setType((prevType) => (prevType === selected ? null : selected));
    setCurrentPage(1);
  }, []);

  const handleBrandChange = useCallback((selectedBrand: string) => {
    setBrand((prevBrand) =>
      prevBrand === selectedBrand ? null : selectedBrand
    );
    setCurrentPage(1);
  }, []);

  const handlePriceChange = useCallback((values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setCurrentPage(1);
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setShowOnlySale(false);
    setSortOption("");
    setType(null);
    setBrand(null);
    setPriceRange({ min: 0, max: 100000 });
    setSearchTerm("");
    setSearchQuery(""); // Reset search query
    setSelectedMain(null);
    setSelectedSub(null);
    setSelectedSubSub(null);
    setCurrentPage(1);
  }, []);

  /**
   * **Handler for Pagination**
   * - Updates the current page based on user interaction with the pagination component.
   */
  const handlePageChange = useCallback((selected: number) => {
    setCurrentPage(selected + 1); // Convert 0-based to 1-based index
  }, []);

  /**
   * **Handlers for Search Functionality**
   * - Manage user interactions with the search bar.
   */
  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value); // Update search term state
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const trimmedSearchTerm = searchTerm.trim();

        if (trimmedSearchTerm !== "") {
          setSearchQuery(trimmedSearchTerm); // Update search query state
          setCurrentPage(1); // Reset to first page
        }
      }
    },
    [searchTerm]
  );

  return (
    <div className="shop-product breadcrumb1 py-2">
      <div className="container">
        <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
          {/* SIDEBAR */}
          <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pr-12">
            {/* Filter Type */}
            <div className="filter-type pb-8 border-b border-line">
              <div className="heading6">Categories</div>
              <div className="list-type-wrapper mt-4 max-h-80 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                <div className="list-type">
                  {/* Main Categories */}
                  {Object.keys(CATEGORY_DATA).map((mainCategory, mainIndex) => (
                    <div key={mainIndex} className="main-category">
                      <div
                        className={`item flex items-center justify-between cursor-pointer p-2 ${
                          selectedMain === mainCategory ? "bg-gray-200" : ""
                        }`}
                        onClick={() => handleMainSelect(mainCategory)}
                      >
                        <div className="text-secondary capitalize">
                          {mainCategory}
                        </div>
                        <div className="ml-2">
                          {selectedMain === mainCategory ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Subcategories */}
                      {selectedMain === mainCategory && (
                        <div className="subcategories pl-4">
                          {Object.keys(CATEGORY_DATA[mainCategory]).map(
                            (subCategory, subIndex) => (
                              <div key={subIndex} className="sub-category">
                                <div
                                  className={`item flex items-center justify-between cursor-pointer p-2 ${
                                    selectedSub === subCategory
                                      ? "bg-gray-200"
                                      : ""
                                  }`}
                                  onClick={() => handleSubSelect(subCategory)}
                                >
                                  <div className="text-secondary capitalize">
                                    {subCategory}
                                  </div>
                                  <div className="ml-2">
                                    {selectedSub === subCategory ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 15l7-7 7 7"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>

                                {/* SubSubcategories */}
                                {selectedSub === subCategory && (
                                  <div className="subsubcategories pl-4">
                                    <ul className="list-disc list-inside">
                                      {CATEGORY_DATA[mainCategory][
                                        subCategory
                                      ].map((subSub, subSubIndex) => (
                                        <li
                                          key={subSubIndex}
                                          className="text-secondary capitalize cursor-pointer p-1 hover:bg-gray-100 rounded"
                                          onClick={() =>
                                            handleSubSubSelect(subSub)
                                          }
                                        >
                                          {subSub}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Price */}
            <div className="filter-price pb-8 border-b border-line mt-8">
                  <div className="heading6">Price Range</div>
                  <Slider
                    range
                    defaultValue={[0, 10000]}
                    min={0}
                    max={100000} // Adjust max as per your data
                    onAfterChange={handlePriceChange} // Use onAfterChange to reduce API calls
                    className="mt-5"
                  />
                  <div className="price-block flex items-center justify-between flex-wrap mt-4">
                    <div className="min flex items-center gap-1">
                      <div>Min price:</div>
                      <div className="price-min">
                        ₹<span>{priceRange.min}</span>
                      </div>
                    </div>
                    <div className="min flex items-center gap-1">
                      <div>Max price:</div>
                      <div className="price-max">
                        ₹<span>{priceRange.max}</span>
                      </div>
                    </div>
                  </div>
                </div>

            {/* Filter Brand */}
            <div className="filter-brand mt-8">
              <div className="heading6">Brands</div>
              <div className="list-brand mt-4">
                {[
                  "Angelbird",
                  "Nikon",
                  "Sony",
                  "Manfrotto",
                  "Panasonic",
                  "Leica",
                  "Olympus",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="brand-item flex items-center justify-between"
                  >
                    <div className="left flex items-center cursor-pointer">
                      <div className="block-input">
                        <input
                          type="checkbox"
                          name={item}
                          id={item}
                          checked={brand === item}
                          onChange={() => handleBrandChange(item)}
                          className="hidden" // Hide the default checkbox
                        />
                        {/* Custom Checkbox Icon */}
                        {brand === item ? (
                          <Icon.CheckSquare
                            size={20}
                            weight="fill"
                            className="icon-checkbox text-primary"
                          />
                        ) : (
                          <Icon.Square size={20} className="icon-checkbox" />
                        )}
                      </div>
                      <label
                        htmlFor={item}
                        className="brand-name capitalize pl-2 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:pl-3">
            {/* Filter heading and Search Bar */}
            <div className="flex justify-between items-center flex-wrap gap-5">
              {/* SEARCH PRODUCTS */}
              <div className="relative w-full max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search Products
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search products..."
                  className="w-full border border-line rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Search Products"
                />
                <Icon.MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSearchQuery(""); // Also clear the search query
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <Icon.X size={20} />
                  </button>
                )}
              </div>

              {/* Sorting Dropdown */}
              <div className="select-block relative">
                <label htmlFor="select-filter" className="sr-only">
                  Sort Products
                </label>
                <select
                  id="select-filter"
                  name="select-filter"
                  className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line appearance-none w-48"
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sortOption || ""}
                  aria-label="Sort Products"
                >
                  <option value="" disabled>
                    Sorting
                  </option>
                  <option value="bestSelling">Best Selling</option>
                  <option value="bestDiscount">Best Discount</option>
                  <option value="priceHighToLow">Price High To Low</option>
                  <option value="priceLowToHigh">Price Low To High</option>
                </select>
                <Icon.CaretDown
                  size={12}
                  className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2 pointer-events-none text-gray-500"
                />
              </div>
            </div>

            {/* List of applied filters (tags) */}
            <div className="list-filtered flex items-center gap-3 mt-4">
              <div className="total-product">
                {totalProducts}
                <span className="text-secondary pl-1">Products Found</span>
              </div>

              {(selectedMain ||
                selectedSub ||
                selectedSubSub ||
                brand ||
                type ||
                searchQuery) && (
                <>
                  <div className="list flex items-center gap-3">
                    <div className="w-px h-4 bg-line"></div>

                    {selectedMain && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer"
                        onClick={() => setSelectedMain(null)}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedMain}</span>
                      </div>
                    )}
                    {selectedSub && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer"
                        onClick={() => setSelectedSub(null)}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedSub}</span>
                      </div>
                    )}
                    {selectedSubSub && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer"
                        onClick={() => setSelectedSubSub(null)}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedSubSub}</span>
                      </div>
                    )}
                    {brand && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer"
                        onClick={() => setBrand(null)}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{brand}</span>
                      </div>
                    )}
                    {type && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer"
                        onClick={() => setType(null)}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{type}</span>
                      </div>
                    )}
                    {searchQuery.trim() !== "" && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer"
                        onClick={() => {
                          setSearchTerm("");
                          setSearchQuery("");
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>Search: &quot;{searchQuery.trim()}&quot;</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                    onClick={handleClearAll}
                  >
                    <Icon.X color="rgb(219, 68, 68)" />
                    <span className="text-button-uppercase text-red">
                      Clear All
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* List of products */}
            <div className="list-product hide-product-sold grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7">
              {loading ? (
                <div className="col-span-full text-center py-10">
                  <svg
                    className="animate-spin h-8 w-8 text-primary mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : error ? (
                <div className="col-span-full text-center text-red-500 py-10">
                  {error}
                </div>
              ) : products.length > 0 ? (
                products.map((item) => (
                  <Product key={item.id} data={item} type="marketplace" />
                ))
              ) : (
                <div className="no-data-product col-span-full text-center py-10">
                  No products match the selected criteria.
                </div>
              )}
            </div>

            {/* Pagination if more than 1 page */}
            {pageCount > 1 && (
              <div className="list-pagination lg:mb-10 md:mb-10 flex items-center md:mt-10 mt-7">
                <HandlePagination
                  pageCount={pageCount}
                  currentPage={currentPage - 1} // Convert 1-based to 0-based index
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopBreadCrumb1;
