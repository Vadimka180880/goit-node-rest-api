export default function validateFavoritePresence(req, res, next) {
  if (!Object.prototype.hasOwnProperty.call(req.body, "favorite")) {
    return res.status(400).json({ message: "Missing field favorite" });
  }
  next();
}