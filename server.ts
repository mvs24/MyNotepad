import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import globalErrorHandler from "./controllers/error";
import userRoutes from "./routes/user";
import noteRoutes from "./routes/note";
import HTTPError from "./utils/HTTPError";
import mongoose from "mongoose";

config({ path: "./config.env" });
const server = express();
server.use(
  cors({
    origin: "*",
  })
);
server.use(express.json());

process.on("uncaughtException", (err: Error) => {
  handleUncaughtExceptionAndRejections(err);
});

const API_ENDPOINT = "/api/v1";

server.use(`${API_ENDPOINT}/users`, userRoutes);
server.use(`${API_ENDPOINT}/notes`, noteRoutes);
server.use("*", (_req: Request, _res: Response, next: NextFunction) => {
  return next(new HTTPError("This route is not yet defined!", 404));
});
server.use(globalErrorHandler);

const startServerAndDatabase = async () => {
  try {
    const mongoConnectionURI: string =
      process.env.DB_CONNECTION_URI ||
      "mongodb://host.docker.internal:27017/notepad";

    const SERVER_PORT = process.env.SERVER_PORT || 5000;

    await mongoose.connect(mongoConnectionURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Database connected successfully!");

    server.listen(SERVER_PORT, () => {
      console.log(`🚀 Server ready at SERVER_PORT ${SERVER_PORT}`);
    });
  } catch (err) {
    console.log("Database failed to start up", err);
    process.exit(1);
  }
};

startServerAndDatabase();

process.on("unhandledRejection", (err: Error) => {
  handleUncaughtExceptionAndRejections(err);
});

function handleUncaughtExceptionAndRejections(err: Error) {
  console.log(err.name, err);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
}
