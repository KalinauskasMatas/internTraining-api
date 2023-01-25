import { Request, Response } from "express";

import userModel from "../models/userModel";

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new userModel({
      ...req.body,
      isAdmin: false,
      rentMovies: [],
    });
    await newUser.save();
    const { password, ...remainingData } = req.body;
    res.status(201).json({ ...remainingData, isAdmin: false, rentMovies: [] });
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};
