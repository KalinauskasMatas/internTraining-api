import { Request, Response } from "express";

import userModel from "../models/userModel";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await userModel.find({}, { password: 0 });
    res.status(202).json(allUsers);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(202).json(user);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};
