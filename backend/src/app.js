import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
let app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.router.js";
import adminRouter from "./routes/admin.router.js";
import bookingRouter from "./routes/booking.router.js";
import groundRouter from "./routes/ground.router.js";
import chatRouter from "./routes/chat.router.js";

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/grounds", groundRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);

app.use(errorHandler);
export default app;
