import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, VerifyErrors } from "jsonwebtoken";

const sessionValidation = (req: Request, res: Response, next: NextFunction) => {
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
  console.log(res.locals.user);
  next();
};

export default sessionValidation;
