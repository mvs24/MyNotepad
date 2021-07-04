import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument } from "../models/user";
import User from "../models/user";
import validator from "validator";
import HTTPError from "../utils/HTTPError";
import { asyncWrapper } from "../utils/asyncWrapper";

const JWT_SECRET = "process.env.JWT_SECRET"; //left here for testing purpose but it needs to be env variable!!!!!

const signToken = (user: UserDocument) => {
  // if (!process.env.JWT_SECRET) {
  //   throw new Error("JWT_KEY is not defined!");
  // }
  return jwt.sign({ user }, JWT_SECRET);
};

const validateEmailAndPassword: (
  email: string,
  password: string,
  next: NextFunction
) => void = (
  email: string,
  password: string,

  next: NextFunction
) => {
  if (!validator.isEmail(email)) {
    return next(
      new HTTPError("Email is invalid. Plase provide a valid email!", 400)
    );
  }
  if (!password || password.length < 6) {
    return next(new HTTPError("Password must be more than 6 characters.", 400));
  }

  return true;
};

export const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new HTTPError("User with this email already exists", 400));
    }

    if (!validator.isEmail(email)) {
      return next(
        new HTTPError("Email is invalid. Plase provide a valid email!", 400)
      );
    }
    if (!password || password.length < 6) {
      return next(
        new HTTPError("Password must be more than 6 characters.", 400)
      );
    }

    const user = User.build({
      email,
      password,
    });

    await user.save();

    user.password = "";
    const token = signToken(user);

    res.status(201).json({
      status: "success",
      token,
      data: {
        email: user.email,
        _id: user._id,
      },
    });
  }
);

export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    validateEmailAndPassword(email, password, next);

    const user = await User.findOne({ email }).select("+password");

    //@ts-ignore
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new HTTPError("User with this email and password does not exists", 401)
      );
    }

    user.password = "";
    const token = signToken(user);

    res.status(201).json({
      status: "success",
      token,
      data: {
        email: user.email,
        _id: user._id,
      },
    });
  }
);

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: undefined | string;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new HTTPError(
        "You are not logged in. Please log in to get access!",
        401
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;

    next();
  } catch (error) {
    if (error instanceof HTTPError) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    }
    return res.status(400).json({
      status: "fail",
      message: "Your token is invalid",
    });
  }
};

export const getMe = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      status: "success",
      data: req.user,
    });
  }
);
