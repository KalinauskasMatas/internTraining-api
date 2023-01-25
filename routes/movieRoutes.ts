import express from "express";
import { addMovie, getMovies } from "../controllers/movieControllers";

const router = express.Router();

router.get("/", getMovies);
router.post("/add", addMovie);

export default router;
