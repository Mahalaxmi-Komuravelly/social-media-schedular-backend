import express from "express";
import { deletePost, getPosts, updatePost, createPost } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const PostRouter = express.Router();

PostRouter.post("/", authMiddleware, createPost);
PostRouter.get("/", authMiddleware, getPosts);
PostRouter.put("/:id", authMiddleware, updatePost);
PostRouter.delete("/:id", authMiddleware, deletePost);