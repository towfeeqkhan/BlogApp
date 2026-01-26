import express from "express";
import { getUser, savePost } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUser);
router.patch("/save", savePost);

export default router;
