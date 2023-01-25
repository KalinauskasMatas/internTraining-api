import express from "express";
import {
  addMovie,
  getMovies,
  removeMovieById,
  updateMovieById,
} from "../controllers/movieController";

const router = express.Router();

router.get("/", getMovies);
router.post("/add", addMovie);
router.put("/update/:id", updateMovieById);
router.delete("/remove/:id", removeMovieById);

export default router;
