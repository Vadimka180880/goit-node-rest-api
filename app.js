import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import path from "path";
import sequelize from "./db/Sequelize.js";
import "./db/User.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
// Serve static avatars
app.use("/avatars", express.static(path.resolve("public", "avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

async function start() {
  try {
    await sequelize.sync();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start app:", e);
    process.exit(1);
  }
}

start();
