import User from "../db/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET = "dev-secret", JWT_EXPIRES_IN = "1h" } = process.env;

export const registerUser = async ({ email, password }) => {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        const err = new Error("Email in use");
        err.status = 409;
        throw err;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    return { email: user.email, subscription: user.subscription };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    await user.update({ token });
    return { token, user: { email: user.email, subscription: user.subscription } };
};

export const logoutUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return false;
    await user.update({ token: null });
    return true;
};

export default { registerUser, loginUser, logoutUser };