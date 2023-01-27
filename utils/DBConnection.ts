import mongoose from "mongoose";

const DBConnection = async () => {
  try {
    if (!process.env.MONGO_URL) throw new Error("No url found in .env file");
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection to the DB is successful");
  } catch (error) {
    console.error(error);
  }
};

export default DBConnection;
