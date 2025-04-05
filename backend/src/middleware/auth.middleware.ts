import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import User from "../models/user/user.schema";

interface AuthRequest extends Request {
  user?: User;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("No auth_token provided or invalid format");
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const auth_token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      auth_token,
      process.env.JWT_SECRET as string
    ) as {
      id: string;
      phone: string;
    };

    const user = await User.findOne({
      where: { id: decoded.id, phone: decoded.phone },
      attributes: ["id", "phone", "isActive"],
    });

    if (!user) {
      logger.warn(`User with ID ${decoded.id} not found in database`);
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (user.isActive === false) {
      logger.warn(`User with ID ${decoded.id} is inactive`);
      res.status(403).json({ message: "User account is inactive" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(
      `Auth middleware error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(401).json({ message: "Invalid auth_token" });
  }
};

export default authMiddleware;
