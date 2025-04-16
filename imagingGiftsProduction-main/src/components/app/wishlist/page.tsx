"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Home/Heading"; // Or your own breadcrumb component
import { ProductType } from "@/type/ProductType";
import Product from "@/components/Product/Product"; // The Product card component
import { useWishlist } from "@/context/WishlistContext"; // Your wishlist context
import HandlePagination from "@/components/Other/HandlePagination";
import * as Icon from "@phosphor-icons/react/dist/ssr";

/**
 * Example sorting options:
 *  - "rateHighToLow": sort by rating descending
 *  - "discountHighToLow": sort by the largest discount
 *  - "priceHighToLow": sort by price descending
 *  - "priceLowToHigh": sort by price ascending
 *
 * Example filter:
 *  - Filter by product.variation === the selected type
 */

const Wishlist: React.FC = () => {
  const { wishlistState } = useWishlist();

  // UI states
  const [sortOption, setSortOption] = useState<string>("");
  const [layoutCol, setLayoutCol] = useState<number>(4);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Pagination config
  const productsPerPage = 12;
  const offset = currentPage * productsPerPage;

  // ----------------------------------------------------------------
  // 1. Filter Logic
  //    We'll assume "typeFilter" means we want product.variation === typeFilter.
  let filteredData: ProductType[] = wishlistState.wishlistArray;

  // If there's a typeFilter selected, filter by product.variation
  if (typeFilter) {
    filteredData = filteredData.filter(
      (product) => product.variation === typeFilter
    );
  }

  // If no items remain, we can show an empty fallback
  const isEmpty = filteredData.length === 0;

  // ----------------------------------------------------------------
  // 2. Sorting Logic
  //    We'll create a copy, so we don't mutate the original array
  let sortedData = [...filteredData];

  switch (sortOption) {
    case "rateHighToLow":
      // If 'rate' is missing, treat it as 0
      sortedData.sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));
      break;

    case "discountHighToLow":
      // discount = 100 - ((offerPrice / mrp) * 100)
      sortedData.sort((a, b) => {
        const discountA = a.priceDetails.mrp
          ? Math.floor(
              100 - (a.priceDetails.offerPrice / a.priceDetails.mrp) * 100
            )
          : 0;
        const discountB = b.priceDetails.mrp
          ? Math.floor(
              100 - (b.priceDetails.offerPrice / b.priceDetails.mrp) * 100
            )
          : 0;
        return discountB - discountA; // largest discount first
      });
      break;

    case "priceHighToLow":
      sortedData.sort(
        (a, b) => b.priceDetails.offerPrice - a.priceDetails.offerPrice
      );
      break;

    case "priceLowToHigh":
      sortedData.sort(
        (a, b) => a.priceDetails.offerPrice - b.priceDetails.offerPrice
      );
      break;

    default:
      break;
  }

  // ----------------------------------------------------------------
  // 3. Pagination
  const pageCount = Math.ceil(sortedData.length / productsPerPage);
  const currentProducts = sortedData.slice(offset, offset + productsPerPage);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  // ----------------------------------------------------------------
  // Handlers for UI controls
  const handleLayoutCol = (col: number) => {
    setLayoutCol(col);
  };

  const handleTypeChange = (value: string) => {
    // If selecting the same type again, unset it
    setTypeFilter((prev) => (prev === value ? undefined : value));
    setCurrentPage(0); // Reset pagination on filter change
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0); // Reset pagination on sort change
  };

  // ----------------------------------------------------------------
  // Render
  return (
    <>
      {/* Example breadcrumb header */}
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Wishlist" subHeading="My favorite products" />
      </div>

      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="list-product-block relative">
            {/* Layout and Sorting Controls */}
            <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
              {/* 1) Layout Controls */}
              <div className="left flex has-line items-center flex-wrap gap-5">
                <div className="choose-layout flex items-center gap-2">
                  {/* Three columns */}
                  <div
                    className={`item p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                      layoutCol === 3 ? "active" : ""
                    }`}
                    onClick={() => handleLayoutCol(3)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                    </div>
                  </div>

                  {/* Four columns */}
                  <div
                    className={`item p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                      layoutCol === 4 ? "active" : ""
                    }`}
                    onClick={() => handleLayoutCol(4)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                    </div>
                  </div>

                  {/* Five columns */}
                  <div
                    className={`item p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                      layoutCol === 5 ? "active" : ""
                    }`}
                    onClick={() => handleLayoutCol(5)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2) Filter & Sort Controls */}
              <div className="right flex items-center gap-3">
                {/* Filter by "variation" (type) */}
                <div className="select-block filter-type relative">
                  <select
                    className="caption1 py-2 pl-3 md:pr-12 pr-8 rounded-lg border border-line capitalize"
                    name="select-type"
                    id="select-type"
                    onChange={(e) => handleTypeChange(e.target.value)}
                    // If none selected, show placeholder
                    value={
                      typeFilter === undefined ? "Filter By Type" : typeFilter
                    }
                  >
                    <option value="Filter By Type" disabled>
                      Filter By Type
                    </option>
                    {/* Example variations */}
                    {["Red", "Blue", "Green", "Large", "Medium", "Small"].map(
                      (item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      )
                    )}
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                  />
                </div>

                {/* Sort Select */}
                <div className="select-block relative">
                  <select
                    id="select-filter"
                    name="select-filter"
                    className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line"
                    onChange={(e) => handleSortChange(e.target.value)}
                    defaultValue="Sorting"
                  >
                    <option value="Sorting" disabled>
                      Sorting
                    </option>
                    <option value="rateHighToLow">Rating: High to Low</option>
                    <option value="discountHighToLow">Best Discount</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                  />
                </div>
              </div>
            </div>

            {/* Filter Summary / Clear Buttons */}
            <div className="list-filtered flex items-center gap-3 mt-4">
              <div className="total-product">
                {isEmpty ? 0 : sortedData.length}
                <span className="text-secondary pl-1">Products Found</span>
              </div>
              {typeFilter && !isEmpty && (
                <>
                  <div className="list flex items-center gap-3">
                    <div className="w-px h-4 bg-line"></div>
                    <div
                      className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                      onClick={() => setTypeFilter(undefined)}
                    >
                      <Icon.X className="cursor-pointer" />
                      <span>{typeFilter}</span>
                    </div>
                  </div>
                  <div
                    className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                    onClick={() => {
                      setTypeFilter(undefined);
                    }}
                  >
                    <Icon.X
                      color="rgb(219, 68, 68)"
                      className="cursor-pointer"
                    />
                    <span className="text-button-uppercase text-red">
                      Clear All
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Product Grid */}
            <div
              className={`list-product hide-product-sold grid lg:grid-cols-${layoutCol} sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7`}
            >
              {isEmpty ? (
                <div className="no-data-product col-span-full">
                  No products match the selected criteria.
                </div>
              ) : (
                currentProducts.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    type="marketplace"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
