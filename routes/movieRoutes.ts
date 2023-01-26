import express from "express";

import {
  addMovie,
  getMovies,
  removeMovieById,
  updateMovieById,
} from "../controllers/movieController";

import {
  verifyAdminPriviledge,
  verifyUserPriviledge,
} from "../utils/priviledgeCheck";

import sessionValidation from "../utils/sessionValidation";

const router = express.Router();

router.get("/", sessionValidation, verifyUserPriviledge, getMovies);
router.post("/add", sessionValidation, verifyAdminPriviledge, addMovie);
router.put(
  "/update/:id",
  sessionValidation,
  verifyAdminPriviledge,
  updateMovieById
);
router.delete(
  "/remove/:id",
  sessionValidation,
  verifyAdminPriviledge,
  removeMovieById
);

export default router;
