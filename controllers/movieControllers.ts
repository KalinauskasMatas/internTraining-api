import { Request, Response } from "express";

import movieModel from "../models/movieModel";

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
