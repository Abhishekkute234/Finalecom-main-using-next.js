// app/context/CartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Define a minimal guest cart item.
interface GuestCartItem {
  productId: string;
  quantity: number;
}

// Enriched cart item includes details fetched from the backend.
export interface EnrichedCartItem extends GuestCartItem {
  productName: string;
  price: number;
  thumbImage: string;
}

interface CartContextProps {
  cart: EnrichedCartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCartAfterOrder: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = "guest-cart";
const CartContext = createContext<CartContextProps | null>(null);

export const CartsProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<EnrichedCartItem[]>([]);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // If the user becomes authenticated, merge the guest cart with the server cart.
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated) {
        await mergeGuestCartWithServer();
        await fetchCart();
      } else {
        console.log("User is not authenticated, using guest cart.");
        await fetchCart();
      }
    };
    handleAuthChange();
  }, [isAuthenticated]);

  const mergeGuestCartWithServer = async () => {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;
    try {
      await Promise.all(
        guestCart.map((item) =>
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
            }),
          })
        )
      );
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Cart sync failed:", error);
    }
  };

  // Read only minimal data from local storage.
  const getGuestCart = (): GuestCartItem[] => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  };

  const saveGuestCart = (items: GuestCartItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  };

  // Enrich each guest item by fetching the latest product details using its productId.
  const enrichCartItems = async (
    items: GuestCartItem[]
  ): Promise<EnrichedCartItem[]> => {
    try {
      return await Promise.all(
        items.map(async (item) => {
          const res = await fetch(`/api/products/${item.productId}`);
          if (!res.ok) throw new Error("Product fetch failed");
          const { data } = await res.json();
          return {
            productId: item.productId,
            quantity: item.quantity,
            productName: data.name,
            price: data.priceDetails.offerPrice, // raw numeric value from API
            thumbImage: data.thumbImage,
          };
        })
      );
    } catch (error) {
      console.error("Cart enrichment error:", error);
      // Fallback in case of an error – these items show placeholders.
      return items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: "Unknown Product",
        price: 0,
        thumbImage: "/placeholder-image.jpg",
      }));
    }
  };

  const fetchCart = async () => {
    try {
      if (isAuthenticated) {
        // For authenticated users, fetch the full cart from your API.
        const res = await fetch("/api/cart");
        const { cart: serverCart } = await res.json();
        setCart(Array.isArray(serverCart) ? serverCart : []);
      } else {
        // For guest users, get the minimal data and then enrich it.
        const guestCart = getGuestCart();
        const enriched = await enrichCartItems(guestCart);
        setCart(enriched);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  const cartOperations = {
    addToCart: async (productId: string, quantity: number) => {
      if (isAuthenticated) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
      } else {
        const guestCart = getGuestCart();
        const existing = guestCart.find((item) => item.productId === productId);

        if (existing) {
          existing.quantity += quantity;
        } else {
          guestCart.push({ productId, quantity });
        }

        saveGuestCart(guestCart);
      }
      await fetchCart();
    },

    updateCart: async (productId: string, quantity: number) => {
      if (quantity < 1) return;
      if (isAuthenticated) {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
      } else {
        const guestCart = getGuestCart().map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        saveGuestCart(guestCart);
      }
      await fetchCart();
    },

    removeFromCart: async (productId: string) => {
      if (isAuthenticated) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } else {
        const guestCart = getGuestCart().filter(
          (item) => item.productId !== productId
        );
        saveGuestCart(guestCart);
      }
      await fetchCart();
    },

    clearCartAfterOrder: async () => {
      if (isAuthenticated) {
        await fetch("/api/cart", { method: "DELETE" });
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCart([]);
      }
    },
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, ...cartOperations }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
