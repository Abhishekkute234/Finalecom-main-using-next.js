"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Default from "@/components/Product/Default";
import Loading from "@/components/Other/Loading";

export default function ProductDefault() {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the product ID from the query string: ?id=someObjectId
  const productId = searchParams.get("id");

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return; // Ensure productId exists before fetching

      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const json = await response.json();
        setProductData(json.data); // Assuming API response structure
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (!productId) return <div>Missing product ID</div>; // Move this check outside of useEffect
  if (loading) return <div><Loading/></div>;
  if (error) return <div>Error: {error}</div>;
  if (!productData) return <div>No product found</div>;

  // Pass the product object (productData) and the productId down to Default
  return <Default data={productData} productId={productId} />;
}
