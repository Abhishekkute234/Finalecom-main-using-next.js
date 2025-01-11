"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { ProductType } from "@/type/ProductType";

interface WishlistItem extends ProductType {
  id: string;
}

interface WishlistState {
  wishlistArray: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD_TO_WISHLIST"; payload: ProductType }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string } // payload is item ID
  | { type: "LOAD_WISHLIST"; payload: WishlistItem[] };

interface WishlistContextProps {
  wishlistState: WishlistState;
  addToWishlist: (item: ProductType) => void;
  removeFromWishlist: (itemId: string) => void;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(
  undefined
);

const WishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      const newItem: WishlistItem = { ...action.payload };
      return {
        ...state,
        wishlistArray: [...state.wishlistArray, newItem],
      };
    case "REMOVE_FROM_WISHLIST":
      // Filter out the item by id
      const updatedWishlist = state.wishlistArray.filter(
        (item) => item.id !== action.payload
      );
      // Save the updated wishlist to localStorage
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return {
        ...state,
        wishlistArray: updatedWishlist,
      };
    case "LOAD_WISHLIST":
      return {
        ...state,
        wishlistArray: action.payload,
      };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistState, dispatch] = useReducer(WishlistReducer, {
    wishlistArray: [],
  });

  // Load wishlist from localStorage when the component mounts
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      dispatch({ type: "LOAD_WISHLIST", payload: JSON.parse(storedWishlist) });
    }
  }, []);

  // Save wishlist to localStorage whenever the wishlist state changes
  useEffect(() => {
    if (wishlistState.wishlistArray.length > 0) {
      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlistState.wishlistArray)
      );
    }
  }, [wishlistState]);

  const addToWishlist = (item: ProductType) => {
    dispatch({ type: "ADD_TO_WISHLIST", payload: item });
  };

  const removeFromWishlist = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: itemId });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistState, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
