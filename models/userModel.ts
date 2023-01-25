import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  rentMovies: [
    {
      id: {
        type: String,
        required: true,
      },
      time: {
        type: Number,
        default: 12,
      },
    },
  ],
});

export default mongoose.model("user", userSchema);
