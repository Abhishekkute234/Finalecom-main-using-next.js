
"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    thumbImage: string; // Add thumbImage here
}

interface CartContextProps {
    cart: CartItem[];
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    updateCart: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCartAfterOrder: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | null>(null);

export const CartsProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Fetch cart data
    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                setCart(data.cart || []);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Add item to cart
    const addToCart = async (productId: string, quantity: number) => {
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });

            if (res.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Update item quantity in cart
    const updateCart = async (productId: string, quantity: number) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });

            if (res.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const clearCartAfterOrder = async () => {
        console.log("Initiating cart clear request...");
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            console.log("Response status:", res.status);
            if (res.ok) {
                console.log("Cart cleared successfully");
                setCart([]); // Clear local cart state
            } else {
                const error = await res.json();
                console.error("Failed to clear the cart:", error.message);
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };



    // Remove item from cart
    const removeFromCart = async (productId: string) => {
        console.log("Removing product with ID:", productId); // Debug log
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }), // Ensure the productId is sent correctly
            });

            if (res.ok) {
                console.log("Product removed successfully");
                await fetchCart(); // Refresh the cart
            } else {
                const error = await res.json();
                console.error("Failed to remove product:", error.message);
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };



    useEffect(() => {
        fetchCart();
    }, []);



    return (
        <CartContext.Provider
            value={{ cart, fetchCart, addToCart, updateCart, removeFromCart, clearCartAfterOrder }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};