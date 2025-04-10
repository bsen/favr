import express from "express";
import postController from "./post.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = express.Router();


router.post("/", authMiddleware, postController.createPost);
router.get("/", authMiddleware, postController.getUserPosts);
router.get("/nearby", authMiddleware, postController.getNearbyPosts);
router.patch("/:id/status", authMiddleware, postController.updatePostStatus);


export default router;
