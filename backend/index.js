import express from "express";
import connectDB from "./lib/connectDB.js";
import commentRouter from "./routes/comment.route.js";
import postRouter from "./routes/post.route.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} at http://localhost:${PORT}`);
  });
});
