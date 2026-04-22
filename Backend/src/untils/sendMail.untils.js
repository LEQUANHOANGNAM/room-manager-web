import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 FIX lỗi self-signed
  },
});

// test kết nối SMTP (debug rất hữu ích)
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ SMTP ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendMail = async (to, subject, text, filePath = null) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: filePath
        ? [
            {
              filename: "invoice.xlsx",
              path: filePath,
            },
          ]
        : [],
    });

    console.log("✅ Mail sent to:", to);
  } catch (err) {
    console.log("❌ Send mail error:", err);
    throw err;
  }
};