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
    console.log(req.body);

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
