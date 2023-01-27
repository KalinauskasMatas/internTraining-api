import { Request, Response } from "express";
import bcrypt from "bcrypt";

import userModel from "../models/userModel";
import movieModel from "../models/movieModel";

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
    const isCurrentUserAdmin = res.locals.user.isAdmin;
    if (!user) {
      return res.status(404).send("No user found with this id");
    }

    if (!req.body.password && !isCurrentUserAdmin) {
      return res.status(404).send("No current password supplied");
    }

    const isPasswordCorrect = isCurrentUserAdmin
      ? true
      : bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid current password");
    }

    const { password, newPassword, ...remainingData } = req.body;

    const newPsw = newPassword ? bcrypt.hashSync(newPassword, 10) : null;

    const newUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: remainingData,
        ...(newPsw ? { password: newPsw } : {}),
        ...(!isCurrentUserAdmin ? { isAdmin: false } : {}),
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

export const rentMovie = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(res.locals.user.id);

    if (!user) {
      return res.status(404).send("User was not found");
    }

    const foundMovieRented = user.rentMovies.filter(
      (movie) => movie.id === req.body.movieId
    );

    if (foundMovieRented.length > 0) {
      return res.status(409).send("User has already rented this book");
    }

    const foundMovie = await movieModel.findById(req.body.movieId);

    if (!foundMovie) {
      return res.status(404).send("Movie with this id was not found");
    }

    if (foundMovie.stock < 1) {
      return res.status(405).send("Movie stock is empty");
    }

    await movieModel.findByIdAndUpdate(req.body.movieId, {
      stock: foundMovie.stock - 1,
    });

    const updatedRentMovies = [
      ...user.rentMovies,
      { id: req.body.movieId, time: 12 },
    ];

    const updatedUser = await userModel.findByIdAndUpdate(
      res.locals.user.id,
      {
        rentMovies: updatedRentMovies,
      },
      { new: true }
    );

    const { password, ...remainingData } = updatedUser!.toJSON();

    return res.status(200).json(remainingData);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const returnMovie = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(res.locals.user.id);

    if (!user) {
      return res.status(404).send("User was not found");
    }

    const foundRentMovie = user.rentMovies.find(
      (movie) => movie.id === req.body.movieId
    );
    if (!foundRentMovie)
      return res.status(404).send("User have no movie with this id");

    const foundAvailableMovie = await movieModel.findById(req.body.movieId);
    if (!foundAvailableMovie)
      return res
        .status(404)
        .send("Movie with this id was not found on the database");

    const updatedMovieList = user.rentMovies.filter(
      (movie) => movie.id !== req.body.movieId
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      res.locals.user.id,
      {
        rentMovies: [...updatedMovieList],
      },
      { new: true }
    );

    await movieModel.findByIdAndUpdate(req.body.movieId, {
      stock: foundAvailableMovie.stock + 1,
    });

    const { password, ...remainingData } = updatedUser!.toJSON();

    return res.status(202).json(remainingData);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};
