"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  thumbImage: string;
}

interface PaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface Order {
  orderId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingInfo: any;
  paymentDetails: PaymentDetails;
  status: string;
  createdAt: string;
}

interface OrderContextProps {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: {
    items: OrderItem[];
    totalAmount: number;
    shippingInfo: any;
    paymentDetails: PaymentDetails;
  }) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextProps | null>(null);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const createOrder = async (orderData: {
    items: OrderItem[];
    totalAmount: number;
    shippingInfo: any;
    paymentDetails: PaymentDetails;
  }) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Order created successfully:");
        await fetchOrders();
      } else {
        const error = await res.json();
        console.error("Error creating order:", error);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{ orders, fetchOrders, createOrder, cancelOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrdersProvider");
  }
  return context;
};
