'use client';

import React, { useEffect, useState } from 'react';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Other/Loading';
import Skeleton from '@/components/Other/Skeleton';
import { useOrder } from '@/context/OrderContext';
import { useCart } from '@/context/CartsContext';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Checkout = ({ searchParams }: { searchParams: { id?: string } }) => {
  const productId = searchParams?.id;
  const { data: session, status } = useSession();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { createOrder } = useOrder();
  const { removeFromCart, fetchCart, clearCartAfterOrder } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  // Fetch data for cart or product-by-ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading
        if (productId) {
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) throw new Error("Failed to fetch product details");

          const data = await response.json();
          if (!data?.data) throw new Error("Product not found");

          setItems([
            {
              productId: data.data._id,
              productName: data.data.productName,
              quantity: 1,
              price: data.data.priceDetails?.offerPrice || data.data.priceDetails?.mrp || 0,
              thumbImage: data.data.thumbImage || "/placeholder.png",
              productSKU: data.data.productSKU || "N/A",
            },
          ]);
        } else {
          const response = await fetch(`/api/cart`);
          if (!response.ok) throw new Error("Failed to fetch cart");

          const data = await response.json();
          setItems(data.cart || []);
        }
      } catch (err) {
        setError((err as Error).message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <Loading />
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
            {error === "Product not found" ? "404 - Product Not Found" : "Error"}
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Your cart is empty. Add items to proceed to checkout.</p>
      </div>
    );
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId); // Call the function to remove the item
      await fetchCart(); // Refresh the cart after removing the item

      setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));

    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove the item. Please try again.");
    }
  };


  const totalCart = items.reduce((total, item) => {
    // Remove commas from the price if it's a string
    const cleanPrice = typeof item.price === "string"
      ? Number(item.price.replace(/,/g, ""))
      : item.price;

    // Calculate the total
    return total + cleanPrice * item.quantity;
  }, 0);

  const deliveryCharge = 50;
  const grandTotal = (totalCart + deliveryCharge).toFixed(2);

  const userEmail = session?.user?.email || '';


  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const shippingInfo = {
      fullName: form.full_name.value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      postalCode: form.postal_code.value,
      phoneNumber: form.phone.value,
    };

    const totalAmount = parseFloat(grandTotal);

    try {
      // Step 1: Create Razorpay Order
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!orderResponse.ok) throw new Error("Failed to create Razorpay order");

      const { order } = await orderResponse.json();

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Website Name",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response: any) => {
          const paymentDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Step 3: Send Payment and Order Details to Backend
          const createOrderResponse = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items,
              totalAmount,
              shippingInfo,
              paymentDetails,
            }),
          });

          if (!createOrderResponse.ok) {
            throw new Error("Failed to create order in database");
          }
          toast.success("Order confirmed! Redirecting to My Orders...");
          await clearCartAfterOrder(); // Clear cart from the backend
          setItems([]); // Clear local cart state

          // Redirect to My Orders page
          router.push("/orders");
        },

        prefill: {
          name: shippingInfo.fullName,
          email: session?.user?.email || "",
          contact: shippingInfo.phoneNumber,
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Payment failed. Please try again.");
    }
  };







  return (
    <div className="checkout-block bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Form */}
          <form className="bg-white shadow-lg rounded-lg p-6" onSubmit={handleCheckout}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center px-4 py-3 bg-gray-100 rounded-lg">
                <Icon.EnvelopeSimple className="text-blue-500 mr-2" />
                <span>{userEmail}</span>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="full_name" className="block text-gray-700 mb-1">Full Name</label>
                <input
                  id="full_name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-1">Address</label>
                <input
                  id="address"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                  placeholder="Enter your address"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
                <input
                  id="city"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div>
                <label htmlFor="postal_code" className="block text-gray-700 mb-1">Postal Code</label>
                <input
                  id="postal_code"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                  placeholder="Enter postal code"
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="state" className="block text-gray-700 mb-1">State</label>
              <select
                id="state"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>

              </select>
            </div>
            <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg shadow">
              Place Order
            </button>
          </form>

          {/* Right Section - Order Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-6 mb-6">
                <Image
                  src={item.thumbImage}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                  width={5000}
                  height={5000}
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.productName}</p>
                  <p className="text-gray-600 text-sm">SKU: {item.productSKU}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Icon.Trash size={24} weight="bold" />
                </button>
              </div>
            ))}


            {/* Price Breakdown */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{new Intl.NumberFormat('en-IN').format(totalCart)}</span>

              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Charge</span>
                <span>₹ {deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{new Intl.NumberFormat('en-IN').format(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
