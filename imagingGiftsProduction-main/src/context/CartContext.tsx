"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { ProductType } from "@/type/ProductType";

interface CartItem extends ProductType {

  id: string;

  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartState {
  cartArray: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: ProductType }
  | { type: "REMOVE_FROM_CART"; payload: string } 
  | {
      type: "UPDATE_CART";
      payload: {
        itemId: string;
        quantity: number;
        selectedSize: string;
        selectedColor: string;
      };
    }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextProps {
  cartState: CartState;
  addToCart: (item: ProductType) => void;
  removeFromCart: (itemId: string) => void;
  updateCart: (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const initialState: CartState = {
  cartArray: [],
};



const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const payload = action.payload;

      // Create a new cart item. We'll use "id" = payload._id
      // so the cart can identify it with the product
      const newItem: CartItem = {
        ...payload,
        id: payload._id,
        quantity: payload.quantityPurchase || 1,
        selectedSize: "",         
        selectedColor: "",
      };

      // Optionally, you may want to check if item already exists in cart
      // If so, you can skip or merge. For now, we'll just add a new item each time.
      const newCart = [...state.cartArray, newItem];
      // Save immediately to localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));

      return {
        ...state,
        cartArray: newCart,
      };
    }
    case "REMOVE_FROM_CART": {
      // Filter out by item.id
      const updatedCart = state.cartArray.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return {
        ...state,
        cartArray: updatedCart,
      };
    }
    case "UPDATE_CART": {
      const { itemId, quantity, selectedSize, selectedColor } = action.payload;
      const updatedCart = state.cartArray.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            selectedSize,
            selectedColor,
          };
        }
        return item; 
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return {
        ...state,
        cartArray: updatedCart,
      };
    }
    case "LOAD_CART": {
      return {
        ...state,
        cartArray: action.payload,
      };
    }
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage when the provider mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(storedCart) });
    }
  }, []);

  // If you want to automatically save after *every* state change, uncomment:
  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cartState.cartArray));
  // }, [cartState]);

  const addToCart = (item: ProductType) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  const updateCart = (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { itemId, quantity, selectedSize, selectedColor },
    });
  };

  return (
    <CartContext.Provider
      value={{ cartState, addToCart, removeFromCart, updateCart }}
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
