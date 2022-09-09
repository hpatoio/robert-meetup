import mongoose from "mongoose";

const URL = process.env.MONGO_URL;

export const connectToMongoDB = async () => {
  await mongoose.connect(URL);
};
