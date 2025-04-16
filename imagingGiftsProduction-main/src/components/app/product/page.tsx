import React from "react";
import Default from "@/components/Product/Default";

import { Metadata } from "next";
import Head from "next/head";
import { ProductStructuredData } from "@/components/Product/StructuredData";
import Loading from "@/components/Other/Loading";

export const generateMetadata = async ({ searchParams }: { searchParams: { id?: string } }): Promise<Metadata> => {
  const productId = searchParams?.id;

  if (!productId) {
    return {
      title: "Product Not Found - Imaging Gifts",
      description: "The product you are looking for does not exist.",
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const data = await response.json();
    if (!data?.data) throw new Error("Product not found");

    const product = data.data;

    return {
      title: `${product.name} - Buy Now at Imaging Gifts`,
      description: `${product.description.substring(0, 160)}...`,
      openGraph: {
        title: `${product.name} - Imaging Gifts`,
        description: `${product.description.substring(0, 160)}...`,
        url: `https://www.imaginggifts.com/products/${productId}`,
        images: [
          {
            url: product.image,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - Imaging Gifts`,
        description: `${product.description.substring(0, 160)}...`,
        images: [product.image],
      },
    };
  } catch (error) {
    return {
      title: "Imaging Gifts",
      description: "There was an error loading the product details.",
    };
  }
};

export default async function ProductDefault({ searchParams }: { searchParams: { id?: string } }) {
  const productId = searchParams?.id;

  if (!productId) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Missing Product ID</h1>
        <p>Please provide a valid product ID to view the product details.</p>
      </div>
    );
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
      next: { revalidate: 60 }, // Enable ISR with revalidation every 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    const data = await response.json();

    if (!data?.data) {
      return (
        <div>
          <h1 className="text-2xl font-bold">404 - Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>
        </div>
      );
    }

    return (
      <div>
        <React.Suspense fallback={<Loading />}>
          <Head>
            <ProductStructuredData product={data.data} />
          </Head>
          <Default data={data.data} productId={productId} />
        </React.Suspense>
      </div>
    );
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return (
      <div>
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error.message || "An unknown error occurred."}</p>
      </div>
    );
  }
}
