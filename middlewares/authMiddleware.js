import jwt from "jsonwebtoken";
import User from "../db/User.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET = "dev-secret" } = process.env;

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
      return next(HttpError(401));
    }
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(id);
      if (!user || user.token !== token) return next(HttpError(401));
      req.user = { id: user.id, email: user.email, subscription: user.subscription };
      next();
    } catch {
      return next(HttpError(401));
    }
  } catch (e) {
    next(e);
  }
}
