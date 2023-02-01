import express from "express";

import {
  addMovie,
  changeTime,
  getMovies,
  removeMovieById,
  rentMovie,
  returnMovie,
  updateMovieById,
} from "../controllers/movieController";

import { verifyAdminPriviledge } from "../utils/priviledgeCheck";

import sessionValidation from "../utils/sessionValidation";

const router = express.Router();

router.get("/", getMovies);
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
router.put("/time", sessionValidation, changeTime);

export default router;
