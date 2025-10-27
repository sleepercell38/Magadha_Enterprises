// import mongoose from "mongoose";

// export const connectDb= async()=>{

// try {
//    await mongoose.connect(process.env.MONGO_URI);
//    console.log("Database connected")
    
// } catch (error) {
//   console.log("database connection error")
//   console.log(error.message)
// }

// };

import mongoose from "mongoose";

let cached = global.mongoose; // Global cache for Vercel serverless functions

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDb = async () => {
  if (cached.conn) {
    // ✅ Use existing connection (no reconnect spam)
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "Magadha",
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

