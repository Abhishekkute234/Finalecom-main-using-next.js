import Head from "next/head";


export function ProductStructuredData({ product }: { product: any }) {
  if (!product) {
    console.error("Product data is missing");
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || "Unknown Product",
    image: product.image || "https://www.imaginggifts.com/default-image.jpg", // Provide a default image
    description: product.description || "No description available.",
    sku: product.sku || "Unknown SKU",
    brand: {
      "@type": "Brand",
      name: product.brand || "Unknown Brand",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.imaginggifts.com/products/${product.id || "unknown-id"}`,
      priceCurrency: "INR",
      price: product.price || 0,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}

