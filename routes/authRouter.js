import express from "express";
import authControllers, { currentController, logoutController, updateSubscriptionController, updateAvatarController, verifyEmailController, resendVerifyController } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authControllers.registerController);

authRouter.post("/login", validateBody(loginSchema), authControllers.loginController);
authRouter.get("/verify/:verificationToken", verifyEmailController);
authRouter.post("/verify", resendVerifyController);

authRouter.get("/current", authMiddleware, currentController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.patch("/subscription", authMiddleware, updateSubscriptionController);
authRouter.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatarController);

export default authRouter;