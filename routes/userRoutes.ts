import express from "express";

import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/authController";

import {
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/userController";

import {
  verifyAdminPriviledge,
  verifyUserPriviledge,
} from "../utils/priviledgeCheck";
import sessionValidation from "../utils/sessionValidation";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get", sessionValidation, verifyAdminPriviledge, getAllUsers);
router.get("/get/:id", sessionValidation, verifyUserPriviledge, getUserById);
router.put(
  "/update/:id",
  sessionValidation,
  verifyUserPriviledge,
  updateUserById
);

export default router;
