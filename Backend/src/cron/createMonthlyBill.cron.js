import cron from "node-cron";
import Room from "../models/room.model.js";
import Payment from "../models/payment.model.js";

cron.schedule("0 0 1 * *", async () => {
  console.log("🔁 Tạo hóa đơn tháng mới...");

  const now = new Date();
  const currentMonth = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

  const rooms = await Room.find({ status: "full" });

  for (let room of rooms) {
    const tenant = room.tenant;

    if (!tenant || !tenant.name) continue;

    const exist = await Payment.findOne({
      roomId: room._id,
      month: currentMonth
    });

    if (!exist) {
      await Payment.create({
        roomId: room._id,
        amount: room.price,
        month: currentMonth,
        status: "pending",
        tenantName: tenant.name
      });
    }
  }

  console.log("✅ Đã tạo hóa đơn tháng");
});