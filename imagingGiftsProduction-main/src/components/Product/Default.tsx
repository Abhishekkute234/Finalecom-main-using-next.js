"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

import { ProductType } from "@/type/ProductType";
import Rate from "@/components/Other/Rate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css/bundle";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import SwiperCore from "swiper/core";

// Context imports

import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import { useCart } from "@/context/CartsContext";

SwiperCore.use([Navigation, Thumbs]);

interface Props {
  data: ProductType; // product from backend
  productId: string; // the ID from the URL
}

const Default: React.FC<Props> = ({ data, productId }) => {
  const swiperRef = useRef<SwiperCore>();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("description");

  // Cart & other contexts
 
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const { cart, updateCart, removeFromCart, addToCart } = useCart();

  // Compare the actual product _id to productId from URL
  // to confirm we have the right product
  const productMain = data._id === productId ? data : null;
  if (!productMain) {
    return <div>Product not found</div>;
  }

  // Calculate sale percentage
  const percentSale = productMain.priceDetails.mrp
    ? Math.floor(
        100 -
          (productMain.priceDetails.offerPrice / productMain.priceDetails.mrp) *
            100
      )
    : 0;

  const handleIncreaseQuantity = () => {
    if (!productMain) return;
    
    // Ensure quantityPurchase is a number before incrementing
    productMain.quantityPurchase = Number(productMain.quantityPurchase) + 1;

    // Update the cart if the item is already in the cart
    updateCart(
      productMain._id,
      productMain.quantityPurchase,
     
    );
  };

  const handleDecreaseQuantity = () => {
    if (!productMain || Number(productMain.quantityPurchase) <= 1) return;

    // Ensure quantityPurchase is a number before decrementing
    productMain.quantityPurchase = Number(productMain.quantityPurchase) - 1;

    updateCart(
      productMain._id,
      productMain.quantityPurchase,
  
    );
  };

  // ADD TO CART
  const handleAddToCart = () => {
    addToCart(productMain._id, 1); // Add one product to the cart


    openModalCart();
  };
  // Add/Remove from wishlist
  const handleAddToWishlist = () => {
    const inWishlist = wishlistState.wishlistArray.some(
      (item) => item._id === productMain._id
    );
    if (inWishlist) {
      removeFromWishlist(productMain._id);
    } else {
      addToWishlist(productMain);
    }
    openModalWishlist();
  };

  // Add/Remove from compare
  const handleAddToCompare = () => {
    if (compareState.compareArray.length < 3) {
      const inCompare = compareState.compareArray.some(
        (item) => item._id === productMain._id
      );
      if (inCompare) {
        removeFromCompare(productMain._id);
      } else {
        addToCompare(productMain);
      }
    } else {
      alert("Compare up to 3 products");
    }
    openModalCompare();
  };

  // Tabs
  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Swiper callbacks
  const handleSwiper = (swiper: SwiperCore) => {
    setThumbsSwiper(swiper);
  };

  // Popup image close
  const closePopupImage = () => setOpenPopupImg(false);

  return (
    <>
      {/* Product Detail Section */}
      <div className="product-detail default">
        <div className="featured-product underwear md:py-20 py-10">
          <div className="container flex justify-between gap-y-6 flex-wrap">
            {/* LEFT COLUMN: Images */}
            <div className="list-img md:w-1/2 md:pr-[45px] w-full">
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="mySwiper2 rounded-2xl overflow-hidden"
              >
                {productMain.images?.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => {
                      swiperRef.current?.slideTo(index);
                      setOpenPopupImg(true);
                    }}
                  >
                    <Image
                      src={item || "/default-image.jpg"}
                      width={1000}
                      height={1000}
                      alt="prd-img"
                      className="w-full aspect-[3/4] object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnail Slider */}

              <div className="h-[50px] mt-4">
                <Swiper
                  onSwiper={handleSwiper}
                  spaceBetween={0}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Navigation, Thumbs]}
                  className="mySwiper"
                >
                  {productMain.images?.slice(0, 4).map((image, index) => (
                    <SwiperSlide key={`image-${index}`}>
                      <Image
                        src={image || "/default-image.jpg"}
                        width={1000}
                        height={1000}
                        alt="Product Image"
                        className="w-full aspect-[3/4] object-contain"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {/* Popup image */}
              <div className={`popup-img ${openPopupImg ? "open" : ""}`}>
                <span
                  className="close-popup-btn absolute top-4 right-4 z-[2] cursor-pointer"
                  onClick={closePopupImage}
                >
                  <Icon.X className="text-3xl text-white" />
                </span>
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  modules={[Navigation, Thumbs]}
                  navigation={true}
                  loop={true}
                  className="popupSwiper"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {productMain.images?.map((item, index) => (
                    <SwiperSlide
                      key={index}
                      onClick={() => setOpenPopupImg(false)}
                    >
                      <Image
                        src={item || "/default-image.jpg"}
                        width={1000}
                        height={1000}
                        alt="prd-img"
                        className="w-full aspect-[3/4] object-contain rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details */}
            <div className="product-infor md:w-1/2 w-full lg:pl-[15px] md:pl-2">
              <div className="flex justify-between">
                <div>
                  <div className="caption2 text-secondary font-semibold uppercase">
                    {productMain.categories.subSub}
                  </div>
                  <div className="heading4 mt-1">{productMain.productName}</div>
                </div>
                <div
                  className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${
                    wishlistState.wishlistArray.some(
                      (item) => item._id === productMain._id
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={handleAddToWishlist}
                >
                  {wishlistState.wishlistArray.some(
                    (item) => item._id === productMain._id
                  ) ? (
                    <Icon.Heart
                      size={24}
                      weight="fill"
                      className="text-white"
                    />
                  ) : (
                    <Icon.Heart size={24} />
                  )}
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center mt-3">
                <Rate currentRate={productMain.rate || 5} size={14} />
                <span className="caption1 text-secondary">(1,234 reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                <div className="product-price heading5">
                  ₹{productMain.priceDetails.offerPrice}.00
                  
                </div>
                <div className="w-px h-4 bg-line"></div>
                {productMain.priceDetails.mrp && (
                  <>
                    <div className="product-origin-price font-normal text-secondary2">
                      <del>₹{productMain.priceDetails.mrp}.00</del>
                    </div>
                    <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                      -{percentSale}%
                    </div>
                  </>
                )}
              </div>

              {/* Variation: Short Description */}
              <div className="list-action mt-6">
                <div className="text-secondary mt-2">
                  {productMain.shortDescription ||
                    "No detailed description available."}
                </div>


            

                {/* Quantity & Add to Cart */}
                <div className="text-title mt-5">Quantity:</div>
                <div className="choose-quantity flex items-center lg:justify-between gap-5 gap-y-3 mt-3">
                  <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                    <Icon.Minus
                      size={20}
                      onClick={handleDecreaseQuantity}
                      className={`${
                        productMain.quantityPurchase <= 1 ? "disabled" : ""
                      } cursor-pointer`}
                    />
                    <div className="body1 font-semibold">
                      {productMain.quantityPurchase}
                    </div>
                    <Icon.Plus
                      size={20}
                      onClick={handleIncreaseQuantity}
                      className="cursor-pointer"
                    />
                  </div>
                  <div
                    onClick={handleAddToCart}
                    className="button-main w-full text-center bg-white text-black border border-black cursor-pointer py-3 rounded-md hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    Add To Cart
                  </div>
                </div>

                {/* Buy It Now */}
                <div className="button-block mt-5">
                  <div
                    onClick={() => {
                      // Implement Buy It Now functionality here
                      // For example, redirect to checkout page
                      // or directly add to cart and navigate
                      handleAddToCart();
                      // Additional logic for Buy It Now
                    }}
                    className="button-main w-full text-center bg-black text-white border border-black cursor-pointer py-3 rounded-md hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    Buy It Now
                  </div>
                </div>

                {/* Compare & Share */}
                <div className="flex items-center lg:gap-20 gap-8 mt-5 pb-6 border-b border-line">
                  <div
                    className="compare flex items-center gap-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCompare();
                    }}
                  >
                    <div className="compare-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                      <Icon.ArrowsCounterClockwise className="heading6" />
                    </div>
                    <span>Compare</span>
                  </div>
                  <div className="share flex items-center gap-3 cursor-pointer">
                    <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                      <Icon.ShareNetwork weight="fill" className="heading6" />
                    </div>
                    <span>Share Products</span>
                  </div>
                </div>

                {/* Shipping & Info */}
                <div className="more-infor mt-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Icon.ArrowClockwise className="body1" />
                      <div className="text-title">Delivery & Return</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon.Question className="body1" />
                      <div className="text-title">Ask A Question</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <Icon.Timer className="body1" />
                    <div className="text-title">Estimated Delivery:</div>
                    <div className="text-secondary">
                      14 January - 18 January
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-3">
                    <div className="text-title">SKU:</div>
                    <div className="text-secondary">
                      {productMain.productSKU}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="text-title">Categories:</div>
                    <div className="text-secondary">
                      {productMain.categories.subSub}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="text-title">Tag:</div>
                    <div className="text-secondary">
                      {productMain.categories.main}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specifications Tabs */}
        <div className="desc-tab md:pb-20 pb-10">
          <div className="container">
            <div className="flex items-center justify-center w-full">
              <div className="menu-tab flex items-center md:gap-[60px] gap-8">
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  onClick={() => handleActiveTab("description")}
                >
                  Description
                </div>
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 ${
                    activeTab === "specifications" ? "active" : ""
                  }`}
                  onClick={() => handleActiveTab("specifications")}
                >
                  Specifications
                </div>
              </div>
            </div>

            <div className="desc-block mt-8">
              {/* Description Tab */}
              <div
                className={`desc-item description ${
                  activeTab === "description" ? "open" : ""
                }`}
              >
                <div className="grid md:grid-cols-2 gap-8 gap-y-5">
                  <div className="left">
                    <div className="heading6">Description</div>
                    <div className="text-secondary mt-2">
                      {productMain.detailedDescription ||
                        "No detailed description available."}
                    </div>
                  </div>
                  <div className="right">
                    <div className="heading6">About This Product</div>
                    <div className="list-feature">
                      <div className="item flex gap-1 text-secondary mt-1">
                        <Icon.Dot size={28} />
                        <p>High-quality materials used.</p>
                      </div>
                      <div className="item flex gap-1 text-secondary mt-1">
                        <Icon.Dot size={28} />
                        <p>Eco-friendly production processes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications Tab */}
              <div
                className={`desc-item specifications flex items-center justify-center ${
                  activeTab === "specifications" ? "open" : ""
                }`}
              >
                <div className="lg:w-1/2 sm:w-3/4 w-full">
                  {/* Rating */}
                  <div className="item bg-surface flex items-start gap-8 py-3 px-10">
                    <div className="text-title sm:w-1/4 w-1/3 flex-shrink-0">
                      Rating
                    </div>
                    <div className="flex items-center gap-1 w-10">
                      <Rate currentRate={productMain.rate || 5} size={12} />
                      <p>(1,234)</p>
                    </div>
                  </div>

                  {/* Outer Shell */}
                  <div className="item flex items-start gap-8 py-3 px-10">
                    <div className="text-title sm:w-1/4 w-1/3 flex-shrink-0">
                      Power Details
                    </div>
                    <p className="flex-grow break-words">
                      {productMain.technicalSpecifications?.powerDetails ||
                        "No information provided about the outer shell."}
                    </p>
                  </div>

                  {/* Accessories */}
                  <div className="item bg-surface flex items-start gap-8 py-3 px-10">
                    <div className="text-title sm:w-1/4 w-1/3 flex-shrink-0">
                      Accessories
                    </div>
                    <p className="flex-grow">
                      {productMain.technicalSpecifications
                        ?.includedAccessories || "N/A"}
                    </p>
                  </div>

                  {/* Colors */}
                  <div className="item flex items-start gap-8 py-3 px-10">
                    <div className="text-title sm:w-1/4 w-1/3 flex-shrink-0">
                      key Specifictions
                    </div>
                   {productMain.technicalSpecifications?.keySpecifications}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* End of Product Detail Section */}
    </>
  );
};

export default Default;
