interface TechnicalSpecifications {
  keySpecifications: string;
  lens: string | null; // Updated to match nullable fields
  powerDetails: string | null; // Updated to match nullable fields
  includedAccessories: string | null; // Updated to match nullable fields
}

interface AdditionalFeatures {
  warranty: string;
  certification: string | null; // Updated to match nullable fields
}

interface ShippingReturns {
  weightAndDimensions: string;
  shippingDetails: string | null; // Updated to match nullable fields
  returnPolicy: string | null; // Updated to match nullable fields
}

interface Categories {
  main: string;
  sub?: string; // Updated to optional to reflect flexible categories
  subSub?: string; // Updated to optional to reflect flexible categories
}

interface PriceDetails {
  mrp: number;
  offerPrice: number;
}

interface Stock {
  status: string;
  count: number;
}

export interface ProductType {
  _id: any; // Field for backend database ID
  id: any; // Field for frontend usage
  productName: string;
  quantityPurchase?: any; // Optional field to reflect purchase quantity
  rate?: number; // Optional rating field
  variation?: string; // Optional variation field
  categories: Categories;
  productSKU: string;
  brand: string;
  priceDetails: PriceDetails;
  stock: Stock;
  shortDescription?: string; // Updated to optional field
  detailedDescription?: string; // Updated to optional field
  technicalSpecifications?: TechnicalSpecifications; // Updated to optional field
  additionalFeatures?: AdditionalFeatures; // Updated to optional field
  shippingReturns?: ShippingReturns; // Updated to optional field
  thumbImage?: string; // Added to replace 'imageUrl' for thumbnail
  images?: string[]; // Added for multiple image support
}
