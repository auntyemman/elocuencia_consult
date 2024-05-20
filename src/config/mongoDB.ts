import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv";

config();

export const mongoDBConnection = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      {} as ConnectOptions,
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
