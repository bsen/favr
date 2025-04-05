import express from "express";
import replyController from "./reply.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, replyController.createReply);
router.get("/post/:postId", authMiddleware, replyController.getPostReplies);
router.get("/user", authMiddleware, replyController.getUserReplies);
router.put(
  "/:replyId/post/:postId/accept",
  authMiddleware,
  replyController.acceptReply
);

export default router;
