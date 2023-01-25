import mongoose from "mongoose";

const DBConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connection to the DB is successful");
  } catch (error) {
    console.error(error);
  }
};

export default DBConnection;
