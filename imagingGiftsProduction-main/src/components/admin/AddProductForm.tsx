"use client";

import React, { useState, useMemo } from "react";

const CATEGORY_DATA: Record<string, Record<string, string[]>> = {
  Photography: {
    Cameras: [
      "DSLR Cameras",
      "Mirrorless Cameras",
      "Point-and-Shoot Cameras",
      "Action Cameras",
      "Film Cameras",
      "Instant Cameras",
      "360° Cameras",
      "Medium Format Cameras",
    ],
    Lenses: [
      "Prime Lenses",
      "Zoom Lenses",
      "Telephoto Lenses",
      "Wide-Angle Lenses",
      "Macro Lenses",
      "Fisheye Lenses",
      "Tilt-Shift Lenses",
      "Anamorphic Lenses",
      "Kit Lenses",
    ],
    "Tripods & Stabilizers": [
      "Monopods",
      "Gimbals",
      "Travel Tripods",
      "Heavy-Duty Tripods",
      "Carbon Fiber Tripods",
      "Tabletop Tripods",
    ],
    "Memory & Storage": [
      "SD Cards",
      "CF Cards",
      "XQD Cards",
      "External Hard Drives",
      "Portable SSDs",
      "MicroSD Cards",
      "Card Readers",
    ],
    "Camera Bags & Cases": [
      "Backpack Cases",
      "Hard Cases",
      "Sling Bags",
      "Messenger Bags",
      "Shoulder Bags",
      "Waterproof Cases",
    ],
    Drones: [
      "Consumer Drones",
      "Professional Drones",
      "FPV Drones",
      "Mini Drones",
      "Aerial Imaging Drones",
      "Drone Accessories",
    ],
    "Underwater Photography": [
      "Underwater Housings",
      "Waterproof Cameras",
      "Dive Lights",
      "Floating Hand Straps",
    ],
    "Remote & Wireless Controls": [
      "Wireless Shutter Remotes",
      "Intervalometers",
      "Smartphone Camera Controllers",
    ],
  },
  Videography: {
    Cameras: [
      "Cinema Cameras",
      "Camcorders",
      "Mirrorless (Video Kits)",
      "Broadcast Cameras",
      "Professional Video Cameras",
      "Pocket Cinema Cameras",
      "PTZ Cameras",
    ],
    "Video Lenses": [
      "Cinema Lenses",
      "Telephoto Video Lenses",
      "Wide-Angle Video Lenses",
      "Anamorphic Lenses",
    ],
    Rigs: [
      "Shoulder Rigs",
      "Cage Rigs",
      "Gimbal Rigs",
      "Modular Rigs",
      "Follow Focus Systems",
    ],
    Microphones: [
      "Shotgun Microphones",
      "Wireless Lavalier Microphones",
      "Boom Mics",
      "Stereo Microphones",
      "Handheld Mics",
    ],
    Recorders: [
      "Field Recorders",
      "Camera-Top Recorders",
      "Multitrack Recorders",
      "Audio Interfaces",
    ],
    Monitors: [
      "On-Camera Monitors",
      "Field Monitors",
      "Broadcast Monitors",
      "HDR Video Monitors",
    ],
    Accessories: ["Viewfinders", "Monitor Hoods", "Video Transmission Systems"],
  },
  Accessories: {
    Filters: [
      "UV Filters",
      "ND Filters",
      "Polarizing Filters",
      "Gradient Filters",
      "Special Effects Filters",
    ],
    "Battery & Power": [
      "Rechargeable Batteries",
      "Battery Grips",
      "Power Adapters",
      "Portable Power Stations",
      "V-Mount Batteries",
    ],
    "Cleaning & Maintenance": [
      "Lens Cleaners",
      "Sensor Cleaners",
      "Air Blowers",
      "Cleaning Kits",
      "Camera Dust Covers",
    ],
    Straps: ["Neck Straps", "Hand Straps", "Wrist Straps", "Chest Harnesses"],
    "Camera Remotes": [
      "Wireless Remotes",
      "Intervalometers",
      "Cable Releases",
      "Smartphone Control Adapters",
    ],
    Lighting: [
      "Ring Lights",
      "Portable LED Panels",
      "Continuous Lighting Kits",
      "RGB LED Lights",
      "Strobe Lights",
    ],
  },
  Lighting: {
    "Lighting Kits": [
      "Continuous Kits",
      "Strobe Kits",
      "LED Kits",
      "Portable Lighting Kits",
      "RGB Lighting Kits",
    ],
    "Flash & Speedlites": [
      "On-Camera Flashes",
      "Studio Strobes",
      "Ring Lights",
    ],
    "Light Modifiers": [
      "Softboxes",
      "Umbrellas",
      "Reflectors",
      "Snoots",
      "Grids",
      "Barn Doors",
    ],
    "Light Stands": [
      "C-Stands",
      "Compact Stands",
      "Heavy-Duty Stands",
      "Boom Arms",
      "Mini Stands",
    ],
    Backgrounds: [
      "Green Screens",
      "Vinyl Backgrounds",
      "Muslin Backgrounds",
      "Collapsible Backgrounds",
      "Paper Rolls",
    ],
  },
  "Editing & Post-Processing": {
    Software: [
      "Photo Editing Software",
      "Video Editing Software",
      "Color Grading Tools",
      "3D Modeling Tools",
    ],
    "Hardware & Peripherals": [
      "Graphics Tablets",
      "Color Calibration Tools",
      "Monitors",
      "Editing Keyboards",
      "Control Surfaces",
    ],
    Plugins: [
      "Photoshop Plugins",
      "Lightroom Presets",
      "Video LUTs",
      "After Effects Plugins",
    ],
    "External Storage": [
      "RAID Systems",
      "Portable SSD Drives",
      "NAS Solutions",
      "Memory Card Wallets",
    ],
  },
  "Photo Tripod & Supports": {
    Tripods: ["Tripod Legs", "Tripod with Head", "Carbon Fiber Tripods"],
    "Video Tripods": ["Fluid Heads", "Tripod Systems with Dollies"],
  },
  "Cables & Adapters": {
    "USB Cables": ["USB-A to C", "USB-C to C"],
    Adapters: ["HDMI Adapters", "Audio Cables", "Video Transmission Cables"],
  },
};

const AddProductForm: React.FC = () => {
  const [formData, setFormData] = useState({
    // Basic fields
    productName: "",
    productSKU: "",
    brand: "",
    mrp: "",
    offerPrice: "",
    rate: "",
    quantityPurchase: "",
    variation: "",
    // Stock
    stockStatus: "",
    stockCount: "",
    // Category fields
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    // Descriptions
    shortDescription: "",
    detailedDescription: "",
    // Technical Specs
    keySpecifications: "",
    lens: "",
    powerDetails: "",
    includedAccessories: "",
    // Additional Features
    warranty: "",
    certification: "",
    // Shipping & Returns
    weightAndDimensions: "",
    shippingDetails: "",
    returnPolicy: "",
  });

  // Image upload states
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);

  // Submission and feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // -----------------------------
  // Category-related logic
  // Dynamically populate subCategory based on mainCategory, and subSubCategory based on subCategory.
  const subCategoryOptions = useMemo(() => {
    if (!formData.mainCategory || !CATEGORY_DATA[formData.mainCategory])
      return [];
    return Object.keys(CATEGORY_DATA[formData.mainCategory]);
  }, [formData.mainCategory]);

  const subSubCategoryOptions = useMemo(() => {
    if (
      !formData.mainCategory ||
      !formData.subCategory ||
      !CATEGORY_DATA[formData.mainCategory]?.[formData.subCategory]
    )
      return [];
    return CATEGORY_DATA[formData.mainCategory][formData.subCategory];
  }, [formData.mainCategory, formData.subCategory]);

  // When mainCategory changes, reset subCategory and subSubCategory
  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      mainCategory: value,
      subCategory: "",
      subSubCategory: "",
    }));
  };

  // When subCategory changes, reset subSubCategory
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subCategory: value,
      subSubCategory: "",
    }));
  };

  // Generic input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file changes
  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbFile(e.target.files[0]);
    } else {
      setThumbFile(null);
    }
  };

  const handleImagesFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagesFiles(Array.from(e.target.files));
    } else {
      setImagesFiles([]);
    }
  };

  // -----------------------------
  // Submit Handler
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    // Payload structure
    const payload = {
      productName: formData.productName,
      categories: {
        main: formData.mainCategory,
        sub: formData.subCategory || undefined,
        subSub: formData.subSubCategory || undefined,
      },
      productSKU: formData.productSKU,
      brand: formData.brand,
      priceDetails: {
        mrp: parseFloat(formData.mrp) || 0,
        offerPrice: parseFloat(formData.offerPrice) || 0,
      },
      stock: {
        status: formData.stockStatus, // "In Stock" or "Out of Stock"
        count: parseInt(formData.stockCount, 10) || 0,
      },
      shortDescription: formData.shortDescription || undefined,
      detailedDescription: formData.detailedDescription || undefined,
      technicalSpecifications: {
        keySpecifications: formData.keySpecifications || undefined,
        lens: formData.lens || undefined,
        powerDetails: formData.powerDetails || undefined,
        includedAccessories: formData.includedAccessories || undefined,
      },
      additionalFeatures: {
        warranty: formData.warranty || undefined,
        certification: formData.certification || undefined,
      },
      shippingReturns: {
        weightAndDimensions: formData.weightAndDimensions || undefined,
        shippingDetails: formData.shippingDetails || undefined,
        returnPolicy: formData.returnPolicy || undefined,
      },
      // optional fields
      rate: parseInt(formData.rate) || 0,
      quantityPurchase: parseInt(formData.quantityPurchase) || 0,
      variation: formData.variation,
    };

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productData", JSON.stringify(payload));

      if (thumbFile) {
        formDataToSend.append("thumbFile", thumbFile);
      }

      imagesFiles.forEach((file) => {
        formDataToSend.append("imagesFiles", file);
      });

      // Example POST request
      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Product added successfully!");
        setFormData({
          productName: "",
          productSKU: "",
          brand: "",
          mrp: "",
          offerPrice: "",
          rate: "",
          quantityPurchase: "",
          variation: "",
          stockStatus: "",
          stockCount: "",
          mainCategory: "",
          subCategory: "",
          subSubCategory: "",
          shortDescription: "",
          detailedDescription: "",
          keySpecifications: "",
          lens: "",
          powerDetails: "",
          includedAccessories: "",
          warranty: "",
          certification: "",
          weightAndDimensions: "",
          shippingDetails: "",
          returnPolicy: "",
        });
        setThumbFile(null);
        setImagesFiles([]);
      } else {
        const errorMessage =
          typeof result === "object" && result.error
            ? JSON.stringify(result.error, null, 2)
            : "Failed to add product.";
        setResponseMessage(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Render
  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-600">
        Add a New Product
      </h1>

      <form onSubmit={submitForm} className="grid grid-cols-2 gap-6">
        {/** Left Column Fields **/}
        <div className="col-span-2 md:col-span-1 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="productName">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
              placeholder="e.g., Canon EOS 5D Mark IV"
            />
          </div>

          {/* Product SKU */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="productSKU">
              Product SKU
            </label>
            <input
              type="text"
              id="productSKU"
              name="productSKU"
              value={formData.productSKU}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
              placeholder="e.g., SKU1234"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="brand">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
              placeholder="e.g., Canon, Nikon, Sony"
            />
          </div>

          {/* MRP & Offer Price */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="mrp">
                MRP
              </label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                value={formData.mrp}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
                placeholder="e.g., 1999"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="offerPrice">
                Offer Price
              </label>
              <input
                type="number"
                id="offerPrice"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
                placeholder="e.g., 1499"
              />
            </div>
          </div>

          {/* Rating & Quantity Purchase */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="rate">
                Rating
              </label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
                placeholder="e.g., 4"
              />
            </div>
            <div className="flex-1">
              <label
                className="block font-semibold mb-1"
                htmlFor="quantityPurchase"
              >
                Quantity Purchase
              </label>
              <input
                type="number"
                id="quantityPurchase"
                name="quantityPurchase"
                value={formData.quantityPurchase || "1"}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
                placeholder="e.g., 10"
              />
            </div>
          </div>

          {/* Variation */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="variation">
              Variation
            </label>
            <input
              type="text"
              id="variation"
              name="variation"
              value={formData.variation}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
              placeholder="e.g., Black, 256GB, etc."
            />
          </div>

          {/* STOCK STATUS & STOCK COUNT */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="stockStatus">
                Stock Status
              </label>
              <select
                id="stockStatus"
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              >
                <option value="">Select stock status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="stockCount">
                Stock Count
              </label>
              <input
                type="number"
                id="stockCount"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
                placeholder="e.g., 50"
              />
            </div>
          </div>
        </div>

        {/** Right Column Fields **/}
        <div className="col-span-2 md:col-span-1 space-y-4">
          {/* Main Category */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="mainCategory">
              Main Category
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              value={formData.mainCategory}
              onChange={handleMainCategoryChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            >
              <option value="">Select a main category</option>
              {Object.keys(CATEGORY_DATA).map((mainCat) => (
                <option key={mainCat} value={mainCat}>
                  {mainCat}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="subCategory">
              Subcategory
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleSubCategoryChange}
              disabled={isSubmitting || !formData.mainCategory}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required={!!formData.mainCategory} // if mainCategory is chosen, subCategory is required
            >
              <option value="">Select a subcategory</option>
              {subCategoryOptions.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Subcategory */}
          <div>
            <label
              className="block font-semibold mb-1"
              htmlFor="subSubCategory"
            >
              Sub-Subcategory
            </label>
            <select
              id="subSubCategory"
              name="subSubCategory"
              value={formData.subSubCategory}
              onChange={handleInputChange}
              disabled={isSubmitting || !formData.subCategory}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required={!!formData.subCategory}
            >
              <option value="">Select a sub-subcategory</option>
              {subSubCategoryOptions.map((subSub) => (
                <option key={subSub} value={subSub}>
                  {subSub}
                </option>
              ))}
            </select>
          </div>

          {/* Category Preview */}
          <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
            <h3 className="font-semibold mb-1 text-sm text-gray-700">
              Selected Categories:
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <strong>Main:</strong> {formData.mainCategory || "—"}
              </li>
              <li>
                <strong>Sub:</strong> {formData.subCategory || "—"}
              </li>
              <li>
                <strong>Sub-Sub:</strong> {formData.subSubCategory || "—"}
              </li>
            </ul>
          </div>

          {/* Short Description */}
          <div>
            <label
              className="block font-semibold mb-1"
              htmlFor="shortDescription"
            >
              Short Description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              rows={2}
              placeholder="Brief summary of the product"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label
              className="block font-semibold mb-1"
              htmlFor="detailedDescription"
            >
              Detailed Description
            </label>
            <textarea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              rows={4}
              placeholder="Explain features, benefits, usage, etc."
            />
          </div>
        </div>

        {/** Full Width Fields **/}
        <div className="col-span-2 border-t pt-6 mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Key Specifications */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="keySpecifications"
              >
                Key Specifications
              </label>
              <textarea
                id="keySpecifications"
                name="keySpecifications"
                value={formData.keySpecifications}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                rows={3}
                placeholder="List key specs or bullet points"
              />
            </div>

            {/* Lens */}
            <div>
              <label className="block font-semibold mb-1" htmlFor="lens">
                Lens
              </label>
              <input
                type="text"
                id="lens"
                name="lens"
                value={formData.lens}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Lens details (optional)"
              />
            </div>

            {/* Power Details */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="powerDetails"
              >
                Power Details
              </label>
              <input
                type="text"
                id="powerDetails"
                name="powerDetails"
                value={formData.powerDetails}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Battery type, power consumption, etc."
              />
            </div>

            {/* Included Accessories */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="includedAccessories"
              >
                Included Accessories
              </label>
              <input
                type="text"
                id="includedAccessories"
                name="includedAccessories"
                value={formData.includedAccessories}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Accessories included with the product"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 border-t pt-6 mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Additional Features
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Warranty */}
            <div>
              <label className="block font-semibold mb-1" htmlFor="warranty">
                Warranty
              </label>
              <input
                type="text"
                id="warranty"
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Warranty information"
              />
            </div>

            {/* Certification */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="certification"
              >
                Certification
              </label>
              <input
                type="text"
                id="certification"
                name="certification"
                value={formData.certification}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Product certifications"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 border-t pt-6 mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Shipping & Returns
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Weight & Dimensions */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="weightAndDimensions"
              >
                Weight & Dimensions
              </label>
              <textarea
                id="weightAndDimensions"
                name="weightAndDimensions"
                value={formData.weightAndDimensions}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                rows={2}
                placeholder="Weight, length, width, height, etc."
              />
            </div>

            {/* Shipping Details */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="shippingDetails"
              >
                Shipping Details
              </label>
              <input
                type="text"
                id="shippingDetails"
                name="shippingDetails"
                value={formData.shippingDetails}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Shipping times, carriers, cost, etc."
              />
            </div>

            {/* Return Policy */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="returnPolicy"
              >
                Return Policy
              </label>
              <input
                type="text"
                id="returnPolicy"
                name="returnPolicy"
                value={formData.returnPolicy}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Return or exchange policy"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 border-t pt-6 mt-4 grid grid-cols-2 gap-4">
          {/* Thumbnail */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="thumbFile">
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbFile"
              accept="image/*"
              onChange={handleThumbFileChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
                         file:mr-4 file:py-2 file:px-4 file:border-0
                         file:text-sm file:bg-indigo-50 file:text-indigo-700"
            />
            {thumbFile && (
              <p className="mt-1 text-sm text-gray-600">{thumbFile.name}</p>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block font-semibold mb-1" htmlFor="imagesFiles">
              Additional Images
            </label>
            <input
              type="file"
              id="imagesFiles"
              accept="image/*"
              multiple
              onChange={handleImagesFilesChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
                         file:mr-4 file:py-2 file:px-4 file:border-0
                         file:text-sm file:bg-indigo-50 file:text-indigo-700"
            />
            {imagesFiles.length > 0 && (
              <ul className="mt-1 text-sm text-gray-600 space-y-1 list-disc list-inside">
                {imagesFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-500 text-white font-semibold py-3 px-4 rounded-md shadow-sm
                        hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500
                        transition duration-200 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 2.0V6H6a6 6 0 000 12h6v-4l-3.5 3.5L10 18v4.0a8 8 0 01-8-8z"
                  ></path>
                </svg>
                <span>Submitting...</span>
              </div>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>

      {responseMessage && (
        <pre
          className={`mt-6 text-center p-3 rounded-lg border whitespace-pre-wrap
            ${
              responseMessage.includes("successfully")
                ? "bg-green-50 border-green-500 text-green-600"
                : "bg-red-50 border-red-500 text-red-600"
            }`}
        >
          {responseMessage}
        </pre>
      )}
    </div>
  );
};

export default AddProductForm;
