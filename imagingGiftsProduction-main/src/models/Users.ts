// models/Users.ts
import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  verified?: boolean;
  verificationToken?: string;
  role: string;
  
}
const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Add roles
});


const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
