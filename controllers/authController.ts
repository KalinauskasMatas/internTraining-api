import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel";

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const hashedPassword = hashPassword(req.body.password);
    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
      isAdmin: false,
      rentMovies: [],
    });
    await newUser.save();

    if (!process.env.JWT_SECRET) throw "No JWT_SECRET found on .env file";

    const { password, ...remainingData } = req.body;
    const token = jwt.sign(
      { id: newUser.id, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "1 day" }
    );

    return res
      .cookie("session_token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({ ...remainingData, isAdmin: false, rentMovies: [] });
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    if (!process.env.JWT_SECRET) throw "No JWT_SECRET found on .env file";

    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid email or password");
    }

    const { password, ...remainingData } = user.toJSON();

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(404).send("Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "1 day" }
    );

    return res
      .cookie("session_token", token, {
        httpOnly: true,
      })
      .status(201)
      .json(remainingData);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res
      .cookie("session_token", "", {
        httpOnly: true,
      })
      .send("Cookie deleted");
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};
