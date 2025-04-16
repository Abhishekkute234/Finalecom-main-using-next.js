"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Home/Heading";
import * as Icon from "@phosphor-icons/react/dist/ssr";

import { countdownTime } from "@/store/countdownTime";
import { useCart } from "@/context/CartsContext";






const Cart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());
  const router = useRouter();

  const { cart, updateCart, removeFromCart } = useCart();

  // Handle quantity changes ensuring quantity is a number
  const handleQuantityChange = (productId: string | number, newQuantity: number): void => {
    if (newQuantity < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }
    updateCart(productId.toString(), newQuantity);
  };


  // Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const moneyForFreeship = 150;
  const [shipCart, setShipCart] = useState(30);
  const [applyCode, setApplyCode] = useState(0);

  // Calculate totalCart using useMemo for optimization
  const totalCart = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  // Calculate discountCart using useMemo
  const discountCart = useMemo(() => {
    if (applyCode === 200) {
      return Math.floor((totalCart / 100) * 10);
    } else if (applyCode === 300) {
      return Math.floor((totalCart / 100) * 15);
    } else if (applyCode === 400) {
      return Math.floor((totalCart / 100) * 20);
    }
    return 0;
  }, [applyCode, totalCart]);

  // Adjust shipping based on totalCart
  useEffect(() => {
    if (totalCart >= moneyForFreeship) {
      setShipCart(0);
    } else {
      setShipCart(30);
    }

    if (cart.length === 0) {
      setShipCart(0);
    }

    if (
      (applyCode === 200 && totalCart < 200) ||
      (applyCode === 300 && totalCart < 300) ||
      (applyCode === 400 && totalCart < 400)
    ) {
      setApplyCode(0);
    }
  }, [totalCart, cart.length, applyCode, moneyForFreeship]);

  const handleApplyCode = (minValue: number, discountPercentage: number): void => {
    if (totalCart >= minValue) {
      setApplyCode(minValue); // Assuming `setApplyCode` is defined elsewhere
    } else {
      alert(`Minimum order must be ₹${minValue}`);
    }
  };


  const redirectToCheckout = () => {
    router.push(`/checkout?discount=${discountCart}&ship=${shipCart}`);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Shopping Cart" subHeading="Shopping Cart" />
      </div>

      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
            <div className="xl:w-2/3 xl:pr-3 w-full">
              <div className="time bg-green py-3 px-5 flex items-center rounded-lg">
                <div className="heding5">🔥</div>
                <div className="caption1 pl-2">
                  Your cart will expire in
                  <span className="min text-red text-button fw-700">
                    {" "}
                    {timeLeft.minutes}:
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds}`
                      : timeLeft.seconds}
                  </span>
                  <span>
                    {" "}
                    minutes! Please checkout now before your items sell out!
                  </span>
                </div>
              </div>

              <div className="heading banner mt-5">
                <div className="text">
                  Buy
                  <span className="text-button">
                    {" "}
                    ₹
                    <span className="more-price">
                      {moneyForFreeship - totalCart > 0
                        ? moneyForFreeship - totalCart
                        : 0}
                    </span>
                    .00 {" "}
                  </span>
                  <span>more to get </span>
                  <span className="text-button">Free Shipping</span>
                </div>
                <div className="tow-bar-block mt-4">
                  <div
                    className="progress-line"
                    style={{
                      width:
                        totalCart <= moneyForFreeship
                          ? `${(totalCart / moneyForFreeship) * 100}%`
                          : `100%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="list-product w-full sm:mt-7 mt-5">
                <div className="w-full">
                  <div className="heading bg-surface bora-4 pt-4 pb-4">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-button text-center">Products</div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Price</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">Quantity</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">
                          Total Price
                        </div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Remove</div>
                      </div>
                    </div>
                  </div>

                  <div className="list-product-main w-full mt-3">
                    {cart.length < 1 ? (
                      <p className="text-button pt-3">No product in cart</p>
                    ) : (
                      cart.map((product) => (
                        <div
                          className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full"
                          key={product.productId}
                        >
                          <div className="w-1/2">
                            <div className="flex items-center gap-6">
                              <div className="bg-img w-20 aspect-[3/4]">
                                <Image
                                  src={
                                    product.thumbImage || "/images/default.png"
                                  }
                                  width={1000}
                                  height={1000}
                                  alt={product.productName}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className=" w-20">
                                <div className=" w-[200px] font-semibold text-xs ">
                                  {product.productName}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-1/12 price flex items-center justify-center">
                            <div className=" text-md  flex ">
                        
                                <span>₹{new Intl.NumberFormat('en-IN').format(product.price)}</span>
                 
                            </div>
                          </div>

                          <div className="w-1/6 flex items-center justify-center">
                            <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] flex-shrink-0 w-20">
                              <Icon.Minus
                                onClick={() =>
                                  handleQuantityChange(
                                    product.productId,
                                    product.quantity - 1
                                  )
                                }
                                className={`text-base max-md:text-sm cursor-pointer ${{
                                  "text-gray-400 cursor-not-allowed":
                                    product.quantity === 1,
                                  "text-black hover:text-gray-600":
                                    product.quantity > 1,
                                }}`}
                              />
                              <div className="text-button quantity">
                                {product.quantity}
                              </div>
                              <Icon.Plus
                                onClick={() =>
                                  handleQuantityChange(
                                    product.productId,
                                    product.quantity + 1
                                  )
                                }
                                className="text-base max-md:text-sm text-black hover:text-gray-600 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="w-1/6 flex total-price items-center justify-center">
                            <div className="text-title text-center">
                
                              ₹{new Intl.NumberFormat('en-IN').format(product.quantity * product.price)}
                            
                            </div>
                          </div>

                          <div className="w-1/12 flex items-center justify-center">
                            <Icon.XCircle
                              className="text-xl max-md:text-base text-red cursor-pointer hover:text-black duration-500"
                              onClick={() => removeFromCart(product.productId)}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="input-block discount-code w-full h-12 sm:mt-7 mt-5">
                <form
                  className="w-full h-full relative"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add voucher discount"
                    className="w-full h-full bg-surface pl-4 pr-14 rounded-lg border border-line"
                    required
                  />
                  <button
                    type="button"
                    className="button-main absolute top-1 bottom-1 right-1 px-5 rounded-lg flex items-center justify-center"
                    onClick={() => {
                      alert("Voucher code functionality not implemented.");
                    }}
                  >
                    Apply Code
                  </button>
                </form>
              </div>

              <div className="list-voucher flex items-center gap-5 flex-wrap sm:mt-7 mt-5">
                <div
                  className={`item ${applyCode === 200 ? "bg-green" : ""
                    } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">10% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from ₹200
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className={`button-main py-1 px-2.5 capitalize text-xs cursor-pointer ${applyCode === 200
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      onClick={() =>
                        applyCode !== 200 &&
                        handleApplyCode(200, Math.floor((totalCart / 100) * 10))
                      }
                    >
                      {applyCode === 200 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>

                <div
                  className={`item ${applyCode === 300 ? "bg-green" : ""
                    } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">15% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from ₹300
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6820</div>
                    <div
                      className={`button-main py-1 px-2.5 capitalize text-xs cursor-pointer ${applyCode === 300
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      onClick={() =>
                        applyCode !== 300 &&
                        handleApplyCode(300, Math.floor((totalCart / 100) * 15))
                      }
                    >
                      {applyCode === 300 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>

                <div
                  className={`item ${applyCode === 400 ? "bg-green" : ""
                    } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">20% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from ₹400
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6830</div>
                    <div
                      className={`button-main py-1 px-2.5 capitalize text-xs cursor-pointer ${applyCode === 400
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      onClick={() =>
                        applyCode !== 400 &&
                        handleApplyCode(400, Math.floor((totalCart / 100) * 20))
                      }
                    >
                      {applyCode === 400 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:w-1/3 left-0 xl:pl-12 w-full mt-5">
              <div className="checkout-block bg-surface p-6 rounded-2xl">
                <div className="heading5">Order Summary</div>

                <div className="total-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Subtotal</div>
                  <div className="text-title">

                    <span>₹{new Intl.NumberFormat('en-IN').format(totalCart)}</span>
                    <span>.00</span>
                  </div>
                </div>

                <div className="discount-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Discounts</div>
                  <div className="text-title">
                    {" "}
                    <span>-₹ </span>
                    <span className="discount">{discountCart}</span>
                    <span>.00</span>
                  </div>
                </div>

                <div className="ship-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Shipping</div>
                  <div className="choose-type flex gap-12">
                    <div className="left">
                      <div className="type">
                        <input
                          id="shipping"
                          type="radio"
                          name="ship"
                          disabled={totalCart < moneyForFreeship}
                          checked={shipCart === 0}
                          onChange={() => setShipCart(0)}
                        />
                        <label className="pl-1" htmlFor="shipping">
                          Free Shipping:
                        </label>
                      </div>

                      <div className="type mt-1">
                        <input
                          id="local"
                          type="radio"
                          name="ship"
                          value={30}
                          checked={shipCart === 30}
                          onChange={() => setShipCart(30)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="local"
                        >
                        </label>
                      </div>

                      <div className="type mt-1">
                        <input
                          id="flat"
                          type="radio"
                          name="ship"
                          value={40}
                          checked={shipCart === 40}
                          onChange={() => setShipCart(40)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="flat"
                        >
                          Flat Rate:
                        </label>
                      </div>
                    </div>

                    <div className="right">
                      <div className="ship">₹ 0.00</div>
                      <div className="local text-on-surface-variant1 mt-1">
                        ₹ 30.00
                      </div>
                      <div className="flat text-on-surface-variant1 mt-1">
                        ₹ 40.00
                      </div>
                    </div>
                  </div>
                </div>

                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                  <div className="heading5">Total</div>
                  <div className="heading5">
     
                    <span >
                   
                      <span className="total-cart ml-1 heading5">₹{new Intl.NumberFormat('en-IN').format(totalCart - discountCart + shipCart)}</span>
                    </span>
              
                  </div>
                </div>

                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                  <div
                    className="checkout-btn button-main text-center w-full cursor-pointer"
                    onClick={redirectToCheckout}
                  >
                    Proceed To Checkout
                  </div>
                  <Link
                    className="text-button hover-underline"
                    href={"/shop"}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;