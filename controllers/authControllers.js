import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { updateSubscriptionSchema, resendVerifySchema } from "../schemas/authSchemas.js";
import { sendVerificationEmail } from "../services/emailService.js";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import User from "../db/User.js";

export const registerController = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ user });
    } catch (err) {
        if (err.status === 409) return next(HttpError(409, "Email in use"));
        next(err);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        if (!result) return res.status(401).json({ message: "Email or password is wrong" });
        res.status(200).json(result);
    } catch (err) {
        if (err.status === 401 && err.message === "Email not verified") {
            return res.status(401).json({ message: "Email not verified" });
        }
        next(err);
    }
};

const authControllers = { registerController, loginController };
export default authControllers;
 
export const currentController = async (req, res, next) => {
    try {
    if (!req.user) return next(HttpError(401));
    const { email, subscription, avatarURL } = req.user;
        res.status(200).json({ email, subscription, avatarURL });
    } catch (err) {
        next(err);
    }
};

export const logoutController = async (req, res, next) => {
    try {
    if (!req.user) return next(HttpError(401));
    const ok = await authService.logoutUser(req.user.id);
    if (!ok) return next(HttpError(401));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const updateSubscriptionController = async (req, res, next) => {
    try {
        if (!req.user) return next(HttpError(401));
        const { error } = updateSubscriptionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });
        const updated = await authService.updateSubscription(req.user.id, req.body.subscription);
        if (!updated) return next(HttpError(401));
        res.status(200).json({ email: updated.email, subscription: updated.subscription });
    } catch (err) {
        next(err);
    }
};

export const updateAvatarController = async (req, res, next) => {
    try {
        if (!req.user) return next(HttpError(401));
        if (!req.file) return res.status(400).json({ message: "Avatar file is required" });

        const avatarsDir = path.resolve("public", "avatars");
        // We convert everything to JPEG; ensure .jpg extension to match content
        const fileName = `avatar_${req.user.id}_${Date.now()}.jpg`;
        const tempPath = req.file.path;
        const finalPath = path.join(avatarsDir, fileName);

        await fs.mkdir(avatarsDir, { recursive: true });

        // Resize to 250x250 and convert to JPEG for consistency
        await sharp(tempPath).resize(250, 250).toFormat("jpeg").jpeg({ quality: 85 }).toFile(finalPath);
        await fs.unlink(tempPath).catch(() => {});

        const avatarURL = `/avatars/${fileName}`;
        const user = await User.findByPk(req.user.id);
        if (!user) return next(HttpError(401));
        await user.update({ avatarURL });

        res.status(200).json({ avatarURL });
    } catch (err) {
        next(err);
    }
};

export const verifyEmailController = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ where: { verificationToken } });
        if (!user) return res.status(404).json({ message: "User not found" });
        await user.update({ verify: true, verificationToken: null });
        res.status(200).json({ message: "Verification successful" });
    } catch (err) {
        next(err);
    }
};

export const resendVerifyController = async (req, res, next) => {
    try {
        const { error } = resendVerifySchema.validate(req.body);
    if (error) return res.status(400).json({ message: "missing required field email" });
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.verify) return res.status(400).json({ message: "Verification has already been passed" });
        // Ensure token exists; if absent, re-generate and save
        let { verificationToken } = user;
        if (!verificationToken) {
            // lazy import nanoid to avoid circular deps
            const { nanoid } = await import("nanoid");
            verificationToken = nanoid();
            await user.update({ verificationToken });
        }
        await sendVerificationEmail(email, verificationToken);
        res.status(200).json({ message: "Verification email sent" });
    } catch (err) {
        next(err);
    }
};


