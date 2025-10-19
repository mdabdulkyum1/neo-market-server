import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import morgan from "morgan";
import router from "./app/routes";


const app: Application = express();

const authOptions = {
   origin: true,
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 }

app.use(
  cors(authOptions)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ Message: "Neo Market server is running. . ." });
});

app.use(morgan("dev"));

app.use("/api/v1", router);

app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;