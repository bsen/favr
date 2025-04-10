import express from "express";
import messageController from "./message.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, messageController.createMessage);

router.get("/post/:postId", authMiddleware, messageController.getPostMessages);

router.get("/threads", authMiddleware, messageController.getUserThreads);

router.get(
  "/thread/:threadId",
  authMiddleware,
  messageController.getThreadMessages
);

export default router;
