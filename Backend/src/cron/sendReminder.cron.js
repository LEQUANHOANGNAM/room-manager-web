import cron from "node-cron";
import Payment from "../models/payment.model.js";
import { sendMail } from "../untils/sendMail.untils.js";

cron.schedule("0 9 5 * *", async () => {
  console.log("📧 Gửi email nhắc thanh toán...");

  const now = new Date();
  const currentMonth = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

  const payments = await Payment.find({
    month: currentMonth,
    status: "pending",
  }).populate("roomId");

  for (let p of payments) {
    const tenant = p.roomId?.tenant;

    if (!tenant?.email) continue;

    await sendMail(
      tenant.email,
      "Nhắc thanh toán tiền phòng",
      `Bạn chưa thanh toán tiền phòng tháng ${currentMonth}`
    );
  }

  console.log("✅ Đã gửi email");
});