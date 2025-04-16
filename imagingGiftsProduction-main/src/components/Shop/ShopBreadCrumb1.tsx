// components/Shop/ShopBreadCrumb1.tsx

"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useRef,
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const debouncedPriceRange = useDebounce(priceRange, 300); // 500ms debounce

  const abortControllerRef = useRef<AbortController | null>(null);
  const prevParams = useRef<string>('');
  const FilterTag = ({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) => (
    <div
      className="flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap cursor-pointer hover:bg-gray-200 transition"
      onClick={onRemove}
    >
      <Icon.X size={12} />
      <span className="capitalize">{label}</span>
    </div>
  );
  




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

  useEffect(() => {
    if (!searchParams) return;
  
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const subSubCategory = searchParams.get("subSubCategory");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
  
    const minPrice = minPriceParam ? parseInt(minPriceParam, 10) : 0;
    const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : 100000;
  
    const newSelectedMain =
      category && CATEGORY_DATA.hasOwnProperty(category) ? category : null;
  
    const newSelectedSub =
      subcategory &&
      newSelectedMain &&
      CATEGORY_DATA[newSelectedMain]?.hasOwnProperty(subcategory)
        ? subcategory
        : null;
  
    const newSelectedSubSub =
      subSubCategory &&
      newSelectedMain &&
      newSelectedSub &&
      CATEGORY_DATA[newSelectedMain]?.[newSelectedSub]?.includes(subSubCategory)
        ? subSubCategory
        : null;
  
    setSelectedMain(newSelectedMain);
    setSelectedSub(newSelectedSub);
    setSelectedSubSub(newSelectedSubSub);
    setPriceRange({ min: minPrice, max: maxPrice });
    setIsFiltersSet(true);
  }, [searchParams]);
  
  // Build query parameters
  const buildQueryParams = useCallback((): QueryParams => {
    const params: QueryParams = { page: currentPage };
  
    if (selectedMain) params.category = selectedMain;
    if (selectedSub) params.subcategory = selectedSub;
    if (selectedSubSub) params.subSubCategory = selectedSubSub;
  
    if (showOnlySale) params.sale = true;
    if (type) params.type = type;
    if (brand) params.brand = brand;
  
    if (searchQuery.trim()) params.search = searchQuery.trim();
  
    if (debouncedPriceRange.min !== 0) params.minPrice = debouncedPriceRange.min;
    if (debouncedPriceRange.max !== 100000) params.maxPrice = debouncedPriceRange.max;
  
    if (sortOption) {
      const sortConfig = {
        bestSelling: { field: "soldQuantity", order: "desc" },
        bestDiscount: { field: "discount", order: "desc" },
        priceHighToLow: { field: "priceDetails.offerPrice", order: "desc" },
        priceLowToHigh: { field: "priceDetails.offerPrice", order: "asc" },
      }[sortOption];
  
      if (sortConfig) {
        params.sortField = sortConfig.field;
        params.sortOrder = sortConfig.order;
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
  
  // Fetch products based on filters
  useEffect(() => {
    if (!isFiltersSet) return; // Only fetch when filters are set
  
    const fetchData = async () => {
      try {
        const params = buildQueryParams();
        const paramsString = JSON.stringify(params);
  
        // Prevent redundant requests
        if (prevParams.current === paramsString) return;
        prevParams.current = paramsString; // Update the params
  
        setLoading(true);
        setError(null);
  
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get<ApiResponse>(`${baseUrl}/api/products`, {
          params,
        });
  
        if (response.data.success) {
          setProducts(response.data.data);
          setTotalProducts(response.data.pagination.total);
          setPageCount(response.data.pagination.pages);
        } else {
          throw new Error("Failed to fetch products.");
        }
      } catch (err: any) {
        console.error("Fetch Error:", err.message || err);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [buildQueryParams, isFiltersSet]);
  
  
  


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
    (e: KeyboardEvent<HTMLInputElement> | React.FormEvent) => {
      // Handle Enter key for desktop keyboards
      if ((e as KeyboardEvent<HTMLInputElement>).key === "Enter" || e.type === "submit") {
        const trimmedSearchTerm = searchTerm.trim();

        if (trimmedSearchTerm !== "") {
          setSearchQuery(trimmedSearchTerm); // Update search query state
          setCurrentPage(1); // Reset to first page
        }

        // Prevent form submission default behavior
        e.preventDefault();
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
            <div className="filter-type pb-8 border-b border-gray-300">
              <div className="heading6 font-semibold text-lg text-gray-700">Categories</div>
              <div className="list-type-wrapper mt-4 max-h-80 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <div className="list-type space-y-4">
                  {/* Main Categories */}
                  {Object.keys(CATEGORY_DATA).map((mainCategory, mainIndex) => (
                    <div key={mainIndex} className="main-category">
                      <div
                        className={`item flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-300 ease-in-out ${selectedMain === mainCategory
                          ? "bg-gray-200 shadow-sm"
                          : "hover:bg-gray-100"
                          }`}
                        onClick={() => handleMainSelect(mainCategory)}
                      >
                        <div className="text-secondary capitalize font-medium text-gray-800">
                          {mainCategory}
                        </div>
                        <div className="ml-2">
                          {selectedMain === mainCategory ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-600"
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
                              className="h-5 w-5 text-gray-600"
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
                        <div className="subcategories pl-6 space-y-3">
                          {Object.keys(CATEGORY_DATA[mainCategory]).map(
                            (subCategory, subIndex) => (
                              <div key={subIndex} className="sub-category">
                                <div
                                  className={`item flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-300 ease-in-out ${selectedSub === subCategory
                                    ? "bg-gray-200 shadow-sm"
                                    : "hover:bg-gray-100"
                                    }`}
                                  onClick={() => handleSubSelect(subCategory)}
                                >
                                  <div className="text-secondary capitalize text-gray-700">
                                    {subCategory}
                                  </div>
                                  <div className="ml-2">
                                    {selectedSub === subCategory ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-600"
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
                                        className="h-5 w-5 text-gray-600"
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
                                  <div className="subsubcategories pl-6">
                                    <ul className="list-disc list-inside space-y-2">
                                      {CATEGORY_DATA[mainCategory][subCategory].map(
                                        (subSub, subSubIndex) => (
                                          <li
                                            key={subSubIndex}
                                            className="text-secondary capitalize cursor-pointer p-2 rounded-md text-gray-700 transition-all duration-200 hover:bg-gray-100"
                                            onClick={() => handleSubSubSelect(subSub)}
                                          >
                                            {subSub}
                                          </li>
                                        )
                                      )}
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
            <div className="filter-price pb-8 border-b border-gray-300 mt-8">
  {/* Section Heading */}
  <div className="heading6 font-semibold text-lg text-gray-800">
    Price Range
  </div>

  {/* Slider */}
  <Slider
    range
    defaultValue={[0, 100000]}
    min={0}
    max={100000} // Adjust max as per your data
    onAfterChange={handlePriceChange} // Use onAfterChange to reduce API calls
    className="mt-6"
  />

  {/* Price Display */}
  <div className="price-block flex items-center justify-between flex-wrap mt-6 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="min flex items-center gap-2 text-gray-700">
      <span className="font-medium">Min Price:</span>
      <span className="price-min font-semibold text-gray-900">
        ₹{priceRange.min}
      </span>
    </div>
    <div className="max flex items-center gap-2 text-gray-700">
      <span className="font-medium">Max Price:</span>
      <span className="price-max font-semibold text-gray-900">
        ₹{priceRange.max}
      </span>
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
                    <div className="left flex items-center my-2 font-semibold cursor-pointer">
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 bg-white p-4 rounded-xl">
  {/* SEARCH PRODUCTS */}
  <div className="relative w-full md:max-w-md">
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
      placeholder="Search for products, brands, categories..."
      className="w-full border border-gray-300 rounded-full bg-white pl-14 pr-14 py-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      aria-label="Search Products"
    />
    <Icon.MagnifyingGlass
      size={18}
      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
    {searchTerm && (
      <button
        type="button"
        onClick={() => {
          setSearchTerm("");
          setSearchQuery("");
        }}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Clear search"
      >
        <Icon.X size={18} />
      </button>
    )}
  </div>

  {/* SORTING DROPDOWN */}
  <div className="relative w-full md:w-auto">
    <label htmlFor="select-filter" className="sr-only">
      Sort Products
    </label>
    <select
      id="select-filter"
      name="select-filter"
      className="w-full md:w-52 border border-gray-300 rounded-full py-3 px-5 pr-10 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
      onChange={(e) => handleSortChange(e.target.value)}
      value={sortOption || ""}
      aria-label="Sort Products"
    >
      <option value="" disabled>
        Sort by
      </option>
      <option value="bestSelling">Best Selling</option>
      <option value="bestDiscount">Best Discount</option>
      <option value="priceHighToLow">Price High To Low</option>
      <option value="priceLowToHigh">Price Low To High</option>
    </select>
    <Icon.CaretDown
      size={16}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
    />
  </div>
</div>



            {/* List of applied filters (tags) */}
       {/* Applied Filters */}
<div className="mt-4 w-full">
  <div className="flex flex-wrap justify-between items-center gap-3">
    {/* Product Count */}
    <div className="text-sm font-medium text-gray-700">
      {totalProducts}
      <span className="text-gray-500 pl-1">Products Found</span>
    </div>

    {/* Clear All Button */}
    {(selectedMain || selectedSub || selectedSubSub || brand || type || searchQuery) && (
      <button
        onClick={handleClearAll}
        className="flex items-center gap-1 text-red-600 border border-red-400 px-3 py-1 rounded-full hover:bg-red-50 transition"
      >
        <Icon.X size={14} />
        <span className="text-sm font-medium">Clear All</span>
      </button>
    )}
  </div>

  {/* Active Filters Scroll Area */}
  {(selectedMain || selectedSub || selectedSubSub || brand || type || searchQuery) && (
    <div className="mt-3 overflow-x-auto w-full">
      <div className="flex items-center gap-2 min-w-max">
        {selectedMain && (
          <FilterTag label={selectedMain} onRemove={() => setSelectedMain(null)} />
        )}
        {selectedSub && (
          <FilterTag label={selectedSub} onRemove={() => setSelectedSub(null)} />
        )}
        {selectedSubSub && (
          <FilterTag label={selectedSubSub} onRemove={() => setSelectedSubSub(null)} />
        )}
        {brand && (
          <FilterTag label={brand} onRemove={() => setBrand(null)} />
        )}
        {type && (
          <FilterTag label={type} onRemove={() => setType(null)} />
        )}
        {searchQuery.trim() !== "" && (
          <FilterTag
            label={`Search: "${searchQuery.trim()}"`}
            onRemove={() => {
              setSearchTerm("");
              setSearchQuery("");
            }}
          />
        )}
      </div>
    </div>
  )}
</div>


  {/* List of Products */}
<div className="relative w-full">
  <div className="list-product hide-product-sold grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-6 mt-8">
  {loading ? (
  Array.from({ length: 6 }).map((_, index) => (
    <div
      key={index}
      className="animate-pulse p-4 border border-gray-200 rounded-2xl bg-white space-y-4"
    >
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-gray-200 rounded-xl"></div>

   

      {/* Product Info Skeleton */}
      <div className="space-y-2 mt-2">
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Price Skeleton */}
      <div className="flex gap-3 mt-2">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-3 mt-4">
        <div className="h-9 w-full bg-gray-300 rounded-lg"></div>
        <div className="h-9 w-full bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  ))
) : error ? (
  <div className="col-span-full text-center text-red-500 py-10">{error}</div>
) : products.length > 0 ? (
  products.map((item) => (
    <Product key={item.id} data={item} type="marketplace" />
  ))
) : (
  <div className="no-data-product col-span-full text-center py-10 rounded-lg shadow-md border border-gray-300">
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">No Products Found</h2>
      <p className="text-gray-500 text-sm">
        We couldn’t find any products matching your criteria. Try adjusting your filters or search keywords.
      </p>
      <button
        onClick={handleClearAll}
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Reset Filters
      </button>
    </div>
  </div>
)}

  </div>
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
