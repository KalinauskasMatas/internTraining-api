import { Request, Response } from "express";
import bcrypt from "bcrypt";

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
    const user = await userModel.findById(req.params.id, { password: 0 });
    res.status(202).json(user);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("No user found with this id");
    }

    if (!req.body.password) {
      return res.status(404).send("No current password suppried");
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid current password");
    }

    const { password, newPassword, ...remainingData } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const newPsw = newPassword ? bcrypt.hashSync(newPassword, salt) : null;

    const newUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: remainingData,
        ...(newPsw ? { password: newPsw } : {}),
      },
      { new: true }
    );

    const { password: newUserPassword, ...newRemainingData } =
      newUser?.toJSON()!;

    return res.status(200).json(newRemainingData);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};
