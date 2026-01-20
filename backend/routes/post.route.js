import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
} from "../controllers/post.controller.js";
const router = express.Router();

router.get("/", getPosts);

router.get("/:slug", getPost);

router.post("/", createPost);

router.delete("/:id", deletePost);

export default router;
