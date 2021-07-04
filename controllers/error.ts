import { Request, Response, NextFunction } from "express";
import HTTPError from "../utils/HTTPError";

const sendErrorDevelopment = (err: HTTPError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProduction = (err: HTTPError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (
  err: HTTPError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  console.log(err);

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProduction(err, res);
  }
};

export default globalErrorHandler;
