import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  listRooms,
  updateRoom,
} from "../controllers/room.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadRoomImages } from "../middlewares/upload.middleware.js";

const router = Router();

// GET
router.get("/", listRooms);
router.get("/:id", getRoom);

// CREATE
router.post(
  "/",
  requireAuth,
  uploadRoomImages.fields([
    { name: "images", maxCount: 15 },
    { name: "avatar", maxCount: 1 }, 
  ]),
  createRoom
);

router.put(
  "/:id",
  requireAuth,
  uploadRoomImages.fields([
    { name: "images", maxCount: 15 },
    { name: "avatar", maxCount: 1 },
  ]),
  updateRoom
);

// DELETE
router.delete("/:id", requireAuth, deleteRoom);

export default router;