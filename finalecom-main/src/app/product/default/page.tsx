"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import productData from "@/data/Product.json";
import Default from "@/components/Product/Default";

const ProductDefault = () => {
  const searchParams = useSearchParams();
  let productId = searchParams.get("id");

  if (productId === null) {
    productId = "1";
  }

  return (
    <>
      <Default data={productData} productId={productId} />
    </>
  );
};

export default ProductDefault;
