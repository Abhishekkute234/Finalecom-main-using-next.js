"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ShopBreadCrumb1 from "@/components/Shop/ShopBreadCrumb1";
import Breadcrumb from "@/components/Home/Heading";
import Loading from "@/components/Other/Loading";

interface Product {
  id: string;
  category: string;
  type: string;
  name: string;
  gender: string;
  new: boolean;
  sale: boolean;
  rate: number;
  price: number;
  originPrice: number;
  brand: string;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  sizes: string[];
  variation: {
    color: string;
    colorCode: string;
    colorImage: string;
    image: string;
  }[];
  thumbImage: string[];
  images: string[];
  description: string;
  action: string;
  slug: string;
}

export default function BreadCrumb1() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<string | null>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const datatype = searchParams.get("type");
  const gender = searchParams.get("gender");
  const category = searchParams.get("category");

  useEffect(() => {
    setType(datatype);
  }, [datatype]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/products?type=${datatype || ""}&gender=${
            gender || ""
          }&category=${category || ""}`
        );
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.error);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    console.log(products);
    

    fetchProducts();
  }, [datatype, gender, category]);

  return (
    <>
      <Breadcrumb heading="Shop" subHeading="Shop" />
      {loading ? (
        <Loading />
      ) : (
        <ShopBreadCrumb1
          data={products}
          productPerPage={9}
          dataType={type}
          gender={gender}
          category={category}
        />
      )}
    </>
  );
}
