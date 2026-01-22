import express from "express";
import connectDB from "./lib/connectDB.js";
import commentRouter from "./routes/comment.route.js";
import postRouter from "./routes/post.route.js";
import userRouter from "./routes/user.route.js";
import webHookRouter from "./routes/webhook.route.js";

const app = express();

app.use("/webhooks", webHookRouter);

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Something went wrong. Please try again later.",
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} at http://localhost:${PORT}`);
  });
});
