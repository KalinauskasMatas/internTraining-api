import express from "express";
import {
  addMovie,
  getMovies,
  removeMovieById,
  updateMovieById,
} from "../controllers/movieController";
import sessionValidation from "../utils/sessionValidation";

const router = express.Router();

router.get("/", sessionValidation, getMovies);
router.post("/add", sessionValidation, addMovie);
router.put("/update/:id", sessionValidation, updateMovieById);
router.delete("/remove/:id", sessionValidation, removeMovieById);

export default router;
