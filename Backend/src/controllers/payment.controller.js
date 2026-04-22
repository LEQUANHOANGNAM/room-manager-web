import { sendMail } from "../untils/sendMail.untils.js";
import { createInvoiceExcel } from "../untils/createInvoiceExcel.until.js";
import Payment from "../models/payment.model.js";
import Room from "../models/room.model.js";

// CONFIG QR
const BANK = "TPB";
const ACCOUNT_NO = "00001936423";

// ================= GET ALL =================
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ONE =================
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("roomId");

    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= PAY BILL =================
export const payBill = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("roomId");

    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }
    
    if (payment.status === "paid") {
      return res.status(400).json({ message: "Đã thanh toán rồi" });
    }

    const tenant = payment.roomId?.tenant;

  
    if (!payment.tenantName) {
      payment.tenantName = tenant?.name || "Unknown";
    }

    payment.status = "paid";
    payment.paidAt = new Date();
    payment.transactionId = "FAKE_" + Date.now();

    await payment.save();

    // gửi mail xác nhận
    const email = tenant?.email?.trim();

    if (email) {
      await sendMail(
        email,
        "Thanh toán thành công",
        `Xin chào ${tenant.name},

Bạn đã thanh toán ${payment.amount} VNĐ cho tháng ${payment.month}.
Phòng: ${payment.roomId.name}

Cảm ơn bạn!`
      );
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CREATE BILL =================
export const testCreateBill = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

    const rooms = await Room.find({ status: "full" });

    let count = 0;

    for (let room of rooms) {
      const tenant = room.tenant;

      if (!tenant || !tenant.name) continue;

      const exist = await Payment.findOne({
        roomId: room._id,
        month: currentMonth,
      });

      if (!exist) {
        const payment = await Payment.create({
          roomId: room._id,
          amount: room.price,
          month: currentMonth,
          status: "pending",
          tenantName: tenant.name,
        });

        // tạo QR
        const qrContent = `PAY_${payment._id}`;
        const qrUrl = `https://img.vietqr.io/image/${BANK}-${ACCOUNT_NO}-compact.png?amount=${payment.amount}&addInfo=${qrContent}`;

        payment.qrCodeUrl = qrUrl;
        await payment.save();

        count++;
      }
    }

    res.json({
      message: "Tạo hóa đơn + QR OK",
      totalCreated: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= SEND REMINDER =================
export const testSendReminder = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

    const payments = await Payment.find({
      status: "pending",
      month: currentMonth,
    }).populate("roomId");

    let sent = 0;
    let skipped = 0;

    for (let p of payments) {
      const tenant = p.roomId?.tenant;

      if (!tenant) {
        skipped++;
        continue;
      }

      const email = tenant.email?.trim();
      if (!email) {
        skipped++;
        continue;
      }

      // ❌ KHÔNG cho gửi nếu chưa nhập điện nước
      if (!p.electricNumber || !p.waterNumber) {
        console.log("❌ Chưa nhập điện nước:", p.roomId.name);
        skipped++;
        continue;
      }

      if (!p.qrCodeUrl) {
        const qrContent = `PAY_${p._id}`;
        p.qrCodeUrl = `https://img.vietqr.io/image/TPB-00001936423-compact.png?amount=${p.amount}&addInfo=${qrContent}`;
        await p.save();
      }

      try {
        const filePath = await createInvoiceExcel({
          roomName: p.roomId.name,
          tenantName: tenant.name,
          roomPrice: p.amount,
          electric: p.electricNumber,
          water: p.waterNumber,
        });

        await sendMail(
          email,
          "Hóa đơn tiền phòng",
          `Xin chào ${tenant.name},

Đây là hóa đơn tháng ${currentMonth}.
Phòng: ${p.roomId.name}

👉 QR:
${p.qrCodeUrl}

(Xem file Excel đính kèm)`,
          filePath
        );

        sent++;
      } catch (err) {
        console.log("❌ Mail lỗi:", err.message);
      }
    }

    res.json({ message: "OK", totalSent: sent, skipped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ================= TEST MAIL =================
export const testSendMail = async (req, res) => {
  try {
    await sendMail(
      "lenam.160304@gmail.com",
      "Test gửi mail",
      "Hello test thành công"
    );

    res.json({ message: "Gửi mail OK" });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= FULL FLOW =================
export const testFullFlow = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

    const rooms = await Room.find({ status: "full" });

    let created = 0;
    let mailed = 0;

    for (let room of rooms) {
      const tenant = room.tenant;

      if (!tenant || !tenant.name) continue;

      let payment = await Payment.findOne({
        roomId: room._id,
        month: currentMonth,
      });

      if (!payment) {
        payment = await Payment.create({
          roomId: room._id,
          amount: room.price,
          month: currentMonth,
          status: "pending",
          tenantName: tenant.name,
        });

        const qrContent = `PAY_${payment._id}`;
        const qrUrl = `https://img.vietqr.io/image/${BANK}-${ACCOUNT_NO}-compact.png?amount=${payment.amount}&addInfo=${qrContent}`;

        payment.qrCodeUrl = qrUrl;
        await payment.save();

        created++;
      }

      if (payment.status === "pending") {
        const email = tenant.email?.trim();
        if(!email) continue;

        await sendMail(
          email,
          "Nhắc thanh toán tiền phòng",
          `Xin chào ${tenant.name},

Bạn chưa thanh toán tiền phòng tháng ${currentMonth}.
Số tiền: ${payment.amount} VNĐ
Phòng: ${room.name}

👉 QR:
${payment.qrCodeUrl}`
        );

        mailed++;
      }
    }

    res.json({
      message: "Full flow OK",
      createdBills: created,
      sentMails: mailed,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= STATS =================
export const getStats = async (req, res) => {
  try {
    const total = await Payment.countDocuments();
    const paid = await Payment.countDocuments({ status: "paid" });

    const revenueAgg = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      total,
      paid,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE ĐIỆN NƯỚC =================
export const updateUsage = async (req, res) => {
  try {
    const { electricNumber, waterNumber } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    payment.electricNumber = electricNumber;
    payment.waterNumber = waterNumber;

    await payment.save();

    res.json({ message: "Cập nhật OK", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE PAYMENT =================
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.json({ message: "Xóa hóa đơn thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};