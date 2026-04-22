import fs from "fs";
import Room from "../models/room.model.js";
import {
  diskPathFromPublicUrl,
  publicImageUrl,
} from "../middlewares/upload.middleware.js";

function parseRemoveImageUrls(body) {
  const raw = body.removeImageUrls;
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function unlinkIfExists(publicUrl) {
  const disk = diskPathFromPublicUrl(publicUrl);
  if (disk && fs.existsSync(disk)) {
    try {
      fs.unlinkSync(disk);
    } catch {}
  }
}

// ================= GET =================
export async function listRooms(req, res) {
  const rooms = await Room.find().sort({ createdAt: -1 });
  res.json(rooms);
}

export async function getRoom(req, res) {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });
  res.json(room);
}

// ================= CREATE =================
export async function createRoom(req, res) {
  try {
    const {
      name,
      roomNumber,
      floor,
      building,
      price,
      status,
      description,

      tenantName,
      tenantPhone,
      tenantCccd,
      tenantEmail,
      tenantStartDate,
      tenantEndDate,
      tenantStatus,
    } = req.body;

    const avatarFile = req.files?.avatar?.[0];
    const avatar = avatarFile ? publicImageUrl(avatarFile.filename) : "";

    const images = (req.files?.images || []).map((f) =>
      publicImageUrl(f.filename)
    );

    const room = await Room.create({
      name,
      roomNumber,
      floor,
      building,
      price: Number(price),
      status,
      description,

      tenant: {
        name: tenantName || "",
        phone: tenantPhone || "",
        cccd: tenantCccd || "",
        email: tenantEmail || "",
        avatar,

        startDate: tenantStartDate || null,
        endDate: tenantEndDate || null,
        status: tenantStatus || "staying",
      },

      images,
    });

    res.json(room);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

// ================= UPDATE =================
export async function updateRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

    const {
      name,
      price,
      status,

      tenantName,
      tenantPhone,
      tenantCccd,
      tenantEmail,
      tenantStartDate,
      tenantEndDate,
      tenantStatus,
    } = req.body;

    if (!room.images) room.images = [];
    if (!room.tenant) room.tenant = {};

    if (name !== undefined) room.name = name;
    if (price !== undefined) room.price = Number(price);
    if (status !== undefined) room.status = status;

    // tenant
    if (tenantName !== undefined) room.tenant.name = tenantName;
    if (tenantPhone !== undefined) room.tenant.phone = tenantPhone;
    if (tenantCccd !== undefined) room.tenant.cccd = tenantCccd;
    if (tenantEmail !== undefined) room.tenant.email = tenantEmail;

    if (tenantStartDate !== undefined)
      room.tenant.startDate = tenantStartDate || null;

    if (tenantEndDate !== undefined)
      room.tenant.endDate = tenantEndDate || null;

    if (tenantStatus !== undefined)
      room.tenant.status = tenantStatus;

    // avatar
    const avatarFile = req.files?.avatar?.[0];
    if (avatarFile) {
      if (room.tenant.avatar) unlinkIfExists(room.tenant.avatar);
      room.tenant.avatar = publicImageUrl(avatarFile.filename);
    }

    // remove images
    const toRemove = parseRemoveImageUrls(req.body);
    for (const url of toRemove) {
      unlinkIfExists(url);
      room.images = room.images.filter((i) => i !== url);
    }

    // add images
    const newFiles = req.files?.images || [];
    for (const f of newFiles) {
      room.images.push(publicImageUrl(f.filename));
    }

    await room.save();
    res.json(room);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

// ================= DELETE =================
export async function deleteRoom(req, res) {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

  room.images.forEach(unlinkIfExists);
  if (room.tenant?.avatar) unlinkIfExists(room.tenant.avatar);

  await room.deleteOne();

  res.json({ message: "Đã xóa" });
}