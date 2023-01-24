import express from "express";
import cors from "cors";

const app = express();
const port = 3005;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
