import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRouter.js";

import contactsRouter from "./routes/contactsRouter.js";
import sequelize from "./db/Sequelize.js";

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);   
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

try {
  await sequelize.authenticate();
  console.log("Database connection successful"); 
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
} catch (error) {
  console.error("Database connection error:", error.message);
  process.exit(1);
}

await sequelize.sync();
