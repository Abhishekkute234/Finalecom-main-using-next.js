"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Order {
  orderId: string;
  userEmail: string;
  paymentDetails: {
    razorpay_order_id: string;
  };
  items: {
    productName: string;
    quantity: number;
    price: number;
    thumbImage: string;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="text-lg font-semibold text-gray-800 animate-pulse">
          Fetching your orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 animate-fade-in">
          You haven’t placed any orders yet!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Start shopping now and discover great products.
        </p>
        <a
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200"
        >
          Explore Products
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">
          My Orders
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {orders.map((order) => (
            <div
              key={order.paymentDetails.razorpay_order_id}
              className="bg-white bg-opacity-90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-700 truncate">
                  Order ID: <span className=" text-xs font-light">{order.paymentDetails.razorpay_order_id}</span>
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                    }`}
                >
                  {order.status}
                </span>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center py-4">
                    <Image
                      src={item.thumbImage}
                      alt={item.productName}
                      className="object-cover rounded-lg border border-gray-300"
                      width={80}
                      height={80}
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-800 text-lg">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-gray-700 text-lg">
                      ₹{item.price * item.quantity}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-lg font-bold text-gray-800">
                  Total: ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  Placed on: {" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
