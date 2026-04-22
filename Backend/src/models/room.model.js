import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roomNumber: { type: String, trim: true, default: "" },
    floor: { type: Number, default: null },
    building: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["empty", "full", "maintenance"],
      default: "empty",
    },
    description: { type: String, trim: true, default: "" },

    tenant: {
      name: { type: String, trim: true, default: "" },
      phone: { type: String, trim: true, default: "" },
      cccd: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, default: "" },

      avatar: { type: String, default: "" }, // 👈 THÊM

      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },

      status: {
        type: String,
        enum: ["staying", "left"],
        default: "staying",
      },
    },

    images: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
