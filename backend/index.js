import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import connectDB from "./lib/connectDB.js";
import commentRouter from "./routes/comment.route.js";
import postRouter from "./routes/post.route.js";
import userRouter from "./routes/user.route.js";
import webHookRouter from "./routes/webhook.route.js";

const app = express();

app.use(cors(process.env.CLIENT_URL));

app.use(clerkMiddleware());

app.use("/webhooks", webHookRouter);

app.use(express.json());

// app.get("/auth-state", (req, res) => {
//   const authState = req.auth();
//   res.json(authState);
// });

// app.get("/protected", (req, res) => {
//   const { userId } = req.auth();

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   res
//     .status(200)
//     .json({ message: "You are authorized to access this protected route." });
// });

// app.get("/protected2", requireAuth(), (req, res) => {
//   res
//     .status(200)
//     .json({ message: "You are authorized to access this protected route." });
// });

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
