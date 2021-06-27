import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import FetchServiceRequest from "./types/requests/fetchServiceRequest";
import fetchService from "./use_cases/fetchService";
import BaseError from "./types/errors/baseError";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  try {
    if (!req.path.startsWith("/api/") || req.path.length < 5) {
      return res.status(400).send("Route should start with /api/");
    }

    const fetchServiceRequest: FetchServiceRequest = {
      path: req.originalUrl,
      headers: req.headers,
      body: req.body,
      method: req.method,
      userToken: req.headers.authorization?.split("Bearer ")[1],
      appToken: <string>req.headers["app-token"],
    };

    return res.send(await fetchService(fetchServiceRequest));
  } catch (error) {
    next(error);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof BaseError)) {
    err = BaseError.fromError(err);
  }
  return res.status(err.code).send({
    message: err.message,
    details: err.details,
  });
});

app.listen(process.env.PORT ? process.env.port : 3000, () => {
  console.log("The application is listening on port 3000!");
});
