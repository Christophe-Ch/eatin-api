import express from "express";
import cookieParser from "cookie-parser";
import FetchServiceRequest from "./types/requests/fetchServiceRequest";
import fetchService from "./use_cases/fetchService";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res) => {
  const fetchServiceRequest: FetchServiceRequest = {
    path: req.path,
    headers: req.headers,
    body: req.body,
    method: req.method,
  };

  try {
    res.send(await fetchService(fetchServiceRequest));
  } catch (error) {}
});

app.listen(3000, () => {
  console.log("The application is listening on port 3000!");
});
