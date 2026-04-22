import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";

import "./src/cron/createMonthlyBill.cron.js";
import "./src/cron/sendReminder.cron.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("API OK");
});

app.use((err, _req, res, next) => {
  if (err?.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  if (err?.message === "Chỉ cho phép file ảnh") {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: err?.message || "Lỗi server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});