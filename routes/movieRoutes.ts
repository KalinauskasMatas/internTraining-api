import express from "express";

import {
  addMovie,
  getMovies,
  removeMovieById,
  rentMovie,
  returnMovie,
  updateMovieById,
} from "../controllers/movieController";

import {
  verifyAdminPriviledge,
  verifyUserPriviledge,
} from "../utils/priviledgeCheck";

import sessionValidation from "../utils/sessionValidation";

const router = express.Router();

router.get("/", sessionValidation, getMovies);
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

router.post("/rent", sessionValidation, rentMovie);
router.post("/return", sessionValidation, returnMovie);

export default router;
