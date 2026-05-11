import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // console.log("uri", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log(error.message);
  }
}

export default connectDB();
