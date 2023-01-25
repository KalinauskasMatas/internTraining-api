import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import DBConnection from "./utils/DBConnection";

import movieRoutes from "./routes/movieRoutes";

const app = express();
const port = 3005;

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/movies", movieRoutes);

app.listen(port, () => {
  DBConnection();
  console.log(`Server started on ${port}`);
});
