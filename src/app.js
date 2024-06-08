import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes

// User routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);

export { app };
