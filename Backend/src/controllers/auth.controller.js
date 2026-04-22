import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

function signAccessToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "name, email, password are required",
    });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = signAccessToken(user._id.toString());

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken(user._id.toString());

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}

// JWT is stateless; client logs out by deleting token.
export async function logout(_req, res) {
  return res.status(204).send();
}

