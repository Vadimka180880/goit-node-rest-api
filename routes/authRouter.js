import express from "express";
import authControllers, { currentController, logoutController } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authControllers.registerController);

authRouter.post("/login", validateBody(loginSchema), authControllers.loginController);

authRouter.get("/current", authMiddleware, currentController);
authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;