import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

const sessionValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.session_token;
  let error = false;

  if (!token) {
    return res.status(404).send("User is not logged in");
  }

  if (!process.env.JWT_SECRET) {
    return res.status(404).send("JWT Secret key not found in .env file");
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { complete: false },
    (err, user) => {
      if (err) {
        error = true;
        return res
          .cookie("session_token", "", {
            httpOnly: true,
          })
          .status(404)
          .send("Token is not valid");
      }
      res.locals.user = user;
    }
  );
  if (error) return;

  const foundUser = await userModel.findById(res.locals.user.id);
  if (!foundUser) {
    return res
      .cookie("session_token", "")
      .status(401)
      .send("Please log in again");
  }
  next();
};

export default sessionValidation;
