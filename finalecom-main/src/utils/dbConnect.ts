import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Global variable to store the connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Add a custom property to the NodeJS global interface
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

// Check if `global.mongooseCache` is already defined, if not initialize it
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // You can pass an empty object for options as Mongoose handles it automatically
    cached.promise = mongoose
      .connect(MONGODB_URI, {})  // Pass an empty object instead of options
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
