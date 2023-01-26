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

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get", getAllUsers);
router.get("/get/:id", getUserById);
router.put("/update/:id", updateUserById);

export default router;
