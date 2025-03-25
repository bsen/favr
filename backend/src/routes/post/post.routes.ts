import express from "express";
import postController from "./post.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();


router.post("/", authMiddleware, postController.createPost);
router.get("/user/posts", authMiddleware, postController.getUserPosts);
router.get("/nearby", authMiddleware, postController.getNearbyPosts);
router.patch("/:id/status", authMiddleware, postController.updatePostStatus);


export default router;
