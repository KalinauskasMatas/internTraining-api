import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import DBConnection from "./utils/DBConnection";

const app = express();
const port = 3005;

dotenv.config();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  DBConnection();
  console.log(`Server started on ${port}`);
});
