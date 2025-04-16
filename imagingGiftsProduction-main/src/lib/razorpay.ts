import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "default_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "default_key_secret",
});

export default razorpayInstance;
