import express from "express";
import cookieParser from "cookie-parser";
import FetchServiceRequest from "./types/requests/fetchServiceRequest";
import fetchService from "./use_cases/fetchService";
import FetchError from "./types/errors/fetchError";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res) => {
  if (!req.path.startsWith("/api/") || req.path.length < 5) {
    return res.status(400).send("Route should start with /api/");
  }

  const fetchServiceRequest: FetchServiceRequest = {
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
    method: req.method,
    userToken: <string>req.headers.authorization,
    appToken: <string>req.headers["app-token"],
  };

  try {
    return res.send(await fetchService(fetchServiceRequest));
  } catch (error) {
    const fetchError: FetchError = error;
    return res.status(400).send({
      message: fetchError.message,
      details: fetchError.details,
    });
  }
});

app.listen(process.env.PORT ? process.env.port : 3000, () => {
  console.log("The application is listening on port 3000!");
});
