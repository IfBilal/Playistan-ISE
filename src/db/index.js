import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("MongoDB successfully connected");
  } catch (err) {
    console.log("MongoDB connection error");
    process.exit(1);
  }
}
export default connectDB;
