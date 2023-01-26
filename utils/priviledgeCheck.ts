import { Request, Response, NextFunction } from "express";

export const verifyUserPriviledge = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(res.locals.user.id === req.params.id) && !res.locals.user.isAdmin) {
    return res
      .status(401)
      .send("You do not have permission for this operation");
  }
  next();
};

export const verifyAdminPriviledge = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.user.isAdmin) {
    return res
      .status(401)
      .send("You do not have permission for this operation");
  }
  next();
};
