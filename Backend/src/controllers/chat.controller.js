import Room from '../models/room.model.js';
import Payment from '../models/payment.model.js';

// ===== CONTROLLER =====
const chatController = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // ===== DATA =====
    const rooms = await Room.find({});
    const payments = await Payment.find({});

    const tenants = [];
    rooms.forEach(room => {
      if (room.tenant?.name) {
        tenants.push({
          name: room.tenant.name,
          room: room.name,
          status: room.tenant.status,
        });
      }
    });

    const roomsData = rooms.map(r => ({
      name: r.name,
      status: r.status,
      price: r.price,
      tenant: r.tenant?.name || '',
    }));

    const paymentsData = payments.map(p => ({
      tenant: p.tenantName,
      amount: p.amount,
      month: p.month,
      status: p.status,
    }));

    // ===== DÙNG AI GIẢ LẬP =====
    const answer = generateFallbackAnswer(
      question,
      roomsData,
      tenants,
      paymentsData
    );

    res.json({ answer });

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: 'Internal error' });
  }
};


// ===== HELPER =====
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// chuyển chữ → số
const wordToNumber = {
  mot: 1, hai: 2, ba: 3, bon: 4, nam: 5,
  sau: 6, bay: 7, tam: 8, chin: 9, muoi: 10
};

function parseVietnameseMath(q) {
  const words = q.split(" ");
  for (let i = 0; i < words.length - 2; i++) {
    const a = wordToNumber[words[i]];
    const op = words[i + 1];
    const b = wordToNumber[words[i + 2]];

    if (a !== undefined && b !== undefined) {
      if (op.includes("cong")) return a + b;
      if (op.includes("tru")) return a - b;
      if (op.includes("nhan")) return a * b;
      if (op.includes("chia")) return b !== 0 ? a / b : "Không chia 0";
    }
  }
  return null;
}


// ===== AI LEVEL 3 =====
function generateFallbackAnswer(question, rooms, tenants, payments) {
  let q = question.toLowerCase();
  q = removeVietnameseTones(q);

  // ===== FIX SAI CHÍNH TẢ NHẸ =====
  q = q.replace(/phog/g, "phong")
       .replace(/khachh/g, "khach")
       .replace(/doanhthu/g, "doanh thu");

  // ===== MATH (SỐ) =====
  const math = q.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
  if (math) {
    const a = +math[1], b = +math[3];
    switch (math[2]) {
      case '+': return `🧮 ${a + b}`;
      case '-': return `🧮 ${a - b}`;
      case '*': return `🧮 ${a * b}`;
      case '/': return b !== 0 ? `🧮 ${a / b}` : "Không chia cho 0";
    }
  }

  // ===== MATH (CHỮ) =====
  const vnMath = parseVietnameseMath(q);
  if (vnMath !== null) return `🧮 ${vnMath}`;

  // ===== INTENTS =====
  const isRoom = /(phong|room)/.test(q);
  const isEmpty = /(trong|chua|available|empty)/.test(q);
  const isFull = /(da|co nguoi|full)/.test(q);
  const isRevenue = /(doanh thu|thu nhap|tien thu)/.test(q);
  const isTenant = /(khach|nguoi thue|tenant)/.test(q);
  const isPayment = /(hoa don|thanh toan|bill)/.test(q);

  // ===== MONTH =====
  const monthMatch = q.match(/(\d{1,2}[-\/]\d{4})/);
  const month = monthMatch ? monthMatch[1] : null;

  // ===== PHÒNG TRỐNG =====
  if (isRoom && isEmpty) {
    const list = rooms.filter(r => r.status === 'empty');
    return list.length
      ? `🏠 Phòng trống:\n${list.map(r => `- ${r.name}`).join('\n')}`
      : 'Không có phòng trống';
  }

  // ===== PHÒNG ĐÃ THUÊ =====
  if (isRoom && isFull) {
    const list = rooms.filter(r => r.status === 'full');
    return list.length
      ? `🏠 Phòng đã thuê:\n${list.map(r => `- ${r.name} (${r.tenant})`).join('\n')}`
      : 'Không có phòng đã thuê';
  }

  // ===== DOANH THU =====
  if (isRevenue) {
    let list = payments.filter(p => p.status === 'paid');
    if (month) list = list.filter(p => p.month === month);

    const total = list.reduce((s, p) => s + p.amount, 0);
    return `💰 Doanh thu${month ? ' ' + month : ''}: ${total.toLocaleString()} VNĐ`;
  }

  // ===== KHÁCH =====
  if (isTenant) {
    return tenants.length
      ? `👤 Khách thuê:\n${tenants.map(t => `- ${t.name} (${t.room})`).join('\n')}`
      : 'Không có khách';
  }

  // ===== HÓA ĐƠN =====
  if (isPayment) {
    let list = payments;

    if (q.includes("chua")) {
      list = list.filter(p => p.status === 'pending');
    }

    if (month) {
      list = list.filter(p => p.month === month);
    }

    return list.length
      ? `💸 Hóa đơn:\n${list.map(p => `- ${p.tenant}: ${p.amount.toLocaleString()} VNĐ (${p.month})`).join('\n')}`
      : 'Không có hóa đơn';
  }

  // ===== CHI TIẾT PHÒNG =====
  const roomMatch = q.match(/phong\s*([a-z0-9]+)/);
  if (roomMatch) {
    const name = roomMatch[1];
    const room = rooms.find(r => r.name.toLowerCase().includes(name));

    if (room) {
      return `🏠 ${room.name}
- ${room.status === 'empty' ? 'Trống' : 'Đã thuê'}
- ${room.price.toLocaleString()} VNĐ
${room.tenant ? `- ${room.tenant}` : ''}`;
    }
  }

  // ===== DEFAULT =====
  return `🤖 Tôi có thể giúp:
- Xem phòng trống
- Danh sách khách
- Doanh thu
- Hóa đơn
- Tính toán (1+1, một cộng hai)

Bạn hỏi tự nhiên nhé 😄`;
}

export default chatController;