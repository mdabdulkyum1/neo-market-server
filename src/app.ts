import cors from "cors";
import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import morgan from "morgan";
import globalErrorHandler from "./app/errors/globalErrorHandler";
import router from "./app/routes";
import { SmsRouters } from "./app/modules/sms/sms.routes";

const app: Application = express();

const authOptions = {
  origin: true, // Allow all origins including scripts and browser extensions
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(authOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ Message: "Neo Market server is running. . ." });
});

app.use(morgan("dev"));

// Mount SMS routers at root level as well for /post-sms and /get-sms
app.use(SmsRouters);

// Mount main API router at /api/v1 (which also includes /api/v1/post-sms and /api/v1/get-sms)
app.use("/api/v1", router);

app.use(globalErrorHandler);

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
