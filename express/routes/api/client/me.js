// middleware requireAuth
import jwt from "jsonwebtoken";
import User from "../../../mongo/schemas/user.js";
import express from "express";

const router = express.Router();

export function requireAuth(req, res, next) {
  console.log("requireAuth: ", req.cookies,"\n");
  const token = req.cookies?.access_token;

  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

// route
router.get("/me", requireAuth, async (req, res) => {
  console.log("me: ", req.auth.userId,"\n");
  const user = await User.findById(req.auth.userId).lean();
  res.json({ name: user.name });
});

export default router;