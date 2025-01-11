"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { ProductType } from "@/type/ProductType";

interface CompareItem extends ProductType {
  id: string;
}

interface CompareState {
  compareArray: CompareItem[];
}

type CompareAction =
  | { type: "ADD_TO_COMPARE"; payload: ProductType }
  | { type: "REMOVE_FROM_COMPARE"; payload: string } // payload is item ID
  | { type: "LOAD_COMPARE"; payload: CompareItem[] };

interface CompareContextProps {
  compareState: CompareState;
  addToCompare: (item: ProductType) => void;
  removeFromCompare: (itemId: string) => void;
}

const CompareContext = createContext<CompareContextProps | undefined>(
  undefined
);

const compareReducer = (
  state: CompareState,
  action: CompareAction
): CompareState => {
  switch (action.type) {
    case "ADD_TO_COMPARE":
      const newItem: CompareItem = { ...action.payload };
      return {
        ...state,
        compareArray: [...state.compareArray, newItem],
      };
    case "REMOVE_FROM_COMPARE":
      // Filter out the item based on ID
      const updatedCompare = state.compareArray.filter(
        (item) => item.id !== action.payload
      );
      // Save the updated compare list to localStorage
      localStorage.setItem("compare", JSON.stringify(updatedCompare));
      return {
        ...state,
        compareArray: updatedCompare,
      };
    case "LOAD_COMPARE":
      return {
        ...state,
        compareArray: action.payload,
      };
    default:
      return state;
  }
};

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [compareState, dispatch] = useReducer(compareReducer, {
    compareArray: [],
  });

  // Load compare list from localStorage when the component mounts
  useEffect(() => {
    const storedCompare = localStorage.getItem("compare");
    if (storedCompare) {
      dispatch({ type: "LOAD_COMPARE", payload: JSON.parse(storedCompare) });
    }
  }, []);

  // Save compare list to localStorage whenever the compare state changes
  useEffect(() => {
    if (compareState.compareArray.length > 0) {
      localStorage.setItem(
        "compare",
        JSON.stringify(compareState.compareArray)
      );
    }
  }, [compareState]);

  const addToCompare = (item: ProductType) => {
    dispatch({ type: "ADD_TO_COMPARE", payload: item });
  };

  const removeFromCompare = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_COMPARE", payload: itemId });
  };

  return (
    <CompareContext.Provider
      value={{ compareState, addToCompare, removeFromCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
