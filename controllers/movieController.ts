import { Request, Response } from "express";

import movieModel from "../models/movieModel";
import userModel from "../models/userModel";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await movieModel.find({});
    res.status(202).json(allMovies);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const addMovie = async (req: Request, res: Response) => {
  try {
    const newMovie = new movieModel({
      ...req.body,
    });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const updateMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await movieModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(movie);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};

export const removeMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await movieModel.findByIdAndDelete(req.params.id);
    res.status(200).json(movie);
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
      return res.status(404).send("User has no movie with this id");

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

export const changeTime = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(res.locals.user.id);

    if (!user) {
      return res.status(404).send("User was not found");
    }

    const foundRentMovie = user.rentMovies.find(
      (movie) => movie.id === req.body.movieId
    );

    if (!foundRentMovie)
      return res.status(404).send("User has no movie with this id");

    if (
      (req.body.changeTime === "increase" && foundRentMovie.time == 168) ||
      (req.body.changeTime === "decrease" && foundRentMovie.time === 12)
    ) {
      res.status(304).send("Movie time was not updated");
    }

    foundRentMovie.time =
      req.body.changeTime === "increase"
        ? foundRentMovie.time + 12
        : foundRentMovie.time - 12;

    const movieIndex = user.rentMovies.findIndex(
      (movie) => movie.id === req.body.movieId
    );

    user.rentMovies.splice(movieIndex, 1, foundRentMovie);

    const updatedUser = await userModel.findByIdAndUpdate(
      res.locals.user.id,
      {
        rentMovies: user.rentMovies,
      },
      { new: true }
    );

    const { password, ...remainingData } = updatedUser!.toJSON();
    res.status(202).json(remainingData);
  } catch (error) {
    res.status(405).send(error);
    console.error(error);
  }
};
