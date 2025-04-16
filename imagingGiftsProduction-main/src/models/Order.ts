  import mongoose, { Schema, Document } from "mongoose";

  interface IOrder extends Document {
    userEmail: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      thumbImage: string;
    }>;
    totalAmount: number;
    shippingInfo: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      phoneNumber: string;
    };
    paymentDetails: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };
    status: "Pending" | "Completed" | "Cancelled"; // Add "Completed" here
    createdAt: Date;
  }

  const OrderSchema = new Schema<IOrder>({
    userEmail: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        thumbImage: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    paymentDetails: {
      razorpay_order_id: { type: String, required: true },
      razorpay_payment_id: { type: String, required: true },
      razorpay_signature: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"], // Ensure "Completed" is included
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  });

  const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

  export default Order;
