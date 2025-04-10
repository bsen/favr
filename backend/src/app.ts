import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import modules from "./models/index";
import userRoutes from "./routes/user/user.routes";
import postRoutes from "./routes/post/post.routes";
import messageRoutes from "./routes/message/message.routes";
import logger from "./utils/logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

const start = async () => {
  try {
    console.log("Attempting to connect to database...");
    await modules.sequelize.authenticate();
    logger.info("Database connected.");
    console.log("Attempting to sync database...");
    await modules.sequelize.sync({ alter: true });
    logger.info("Database synced.");

    app.listen(port, () => {
      logger.info(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Full error object:", error);
    logger.error(
      `Failed to start server: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`
    );
    process.exit(1);
  }
};

start();
