import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import modules from "./models/index.js";
import userRoutes from "./routes/user/user.routes.js";
import logger from "./utils/logger.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/api/v1/user", userRoutes);

const start = async () => {
  try {
    await modules.sequelize.authenticate();
    logger.info("Database connected.");
    await modules.sequelize.sync({ alter: true });
    logger.info("Database synced.");

    app.listen(port, () => {
      logger.info(`http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(
      `Failed to start server: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    process.exit(1);
  }
};

start();
