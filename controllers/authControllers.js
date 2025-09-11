import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { updateSubscriptionSchema } from "../schemas/authSchemas.js";

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
        next(err);
    }
};

const authControllers = { registerController, loginController };
export default authControllers;
 
export const currentController = async (req, res, next) => {
    try {
    if (!req.user) return next(HttpError(401));
    const { email, subscription } = req.user;
        res.status(200).json({ email, subscription });
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


