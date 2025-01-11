import React from "react";
import Image from "next/image";

// Define the Product Props interface
interface ProductProps {
  productName: string;
  priceDetails: {
    mrp: number;
    offerPrice: number;
  };
  image?: string; // Optional to handle cases where no image is provided
  onAddToCart: () => void;
}

const Product1: React.FC<ProductProps> = ({
  productName,
  priceDetails,
  image,
  onAddToCart,
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-lg max-w-sm">
      {/* Product Image */}
      <div className="relative w-full h-48 mb-4">
        {image ? (
          <Image
            src={image}
            alt={productName}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        ) : (
          <div className="bg-gray-300 w-full h-full flex items-center justify-center rounded">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}
      </div>

      {/* Product Name */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {productName}
      </h2>

      {/* Price Details */}
      <div className="mb-4">
        <p className="text-gray-500 line-through">MRP: ₹{priceDetails.mrp}</p>
        <p className="text-lg font-bold text-green-600">
          Offer Price: ₹{priceDetails.offerPrice}
        </p>
      </div>

      {/* Add to Cart Button */}
      <button
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product1;
