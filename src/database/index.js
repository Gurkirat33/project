import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
  try {
    const res = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDb connected", res.connection.host);
  } catch (error) {
    console.log("Database connecttion error", error);
  }
};
