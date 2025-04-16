import Image from "next/image";
import Link from "next/link";
import React from "react";

const Collection = () => {
  return (
    <div className="bg-gradient-to-b  to-white py-10 my-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap mb-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase border-b-4 border-blue-500 pb-2">
            Our Collections
          </h2>
          <Link
            href="/shop"
            className="text-blue-600 font-medium hover:text-blue-800 transition-all border-b-2 border-transparent hover:border-blue-500"
          >
            View All
          </Link>
        </div>

        {/* Collection List */}
        <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-8">
          {/* Collection Item */}
          {[
            {
              title: "Mirrorless Cameras",
              image: "/images/collection/marketplace1.png",
              alt: "Mirrorless Camera",
              links: ["Sony", "Nikon", "Canon", "Lumix"],
              category: "All Cameras",
            },
            {
              title: "Camera Lenses",
              image: "/images/collection/marketplace2.png",
              alt: "Camera Lenses",
              links: ["Wide Angle", "Zoom Lenses", "Prime Lenses", "Macro Lenses"],
              category: "All Lenses",
            },
            {
              title: "Tripods",
              image: "/images/collection/marketplace3.png",
              alt: "Tripods",
              links: ["Travel Tripods", "Professional Tripods", "Flexible Tripods", "Mini Tripods"],
              category: "All Tripods",
            },
            {
              title: "Camera Accessories",
              image: "/images/collection/marketplace4.png",
              alt: "Camera Accessories",
              links: ["Batteries", "Chargers", "Straps", "Cleaning Kits"],
              category: "All Accessories",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 bg-white border border-gray-200 shadow-sm rounded-lg hover:shadow-lg transition-shadow"
            >
              <Link href="/shop" className="w-24 h-24 flex-shrink-0">
                <Image
                  width={5000}
                  height={5000}
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover rounded-md"
                />
              </Link>
              <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <ul className="text-gray-600 space-y-1">
                  {item.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href="/shop"
                        className="hover:text-blue-500 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/shop"
                  className="flex items-center gap-2 mt-4 text-blue-600 font-medium hover:text-blue-800 transition-all"
                >
                  <span>{item.category}</span>
                  <i className="ph-bold ph-caret-double-right text-sm"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
