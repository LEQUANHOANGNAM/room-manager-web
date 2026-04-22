import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    tenantName: String,
    amount: Number,

    month: String,

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    electricNumber: {
      type: Number,
      default: 0,
    },
    waterNumber: {
      type: Number,
      default: 0,
    },
    dueDate: { type: Date },
    paidAt: { type: Date },

    qrCodeUrl: String,

    transactionId: String,
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
