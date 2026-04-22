import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const createInvoiceExcel = async ({
  roomName,
  tenantName,
  roomPrice,
  electric,
  water,
}) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Invoice");

  const ELECTRIC_PRICE = 3500;
  const WATER_PRICE = 15000;

  sheet.columns = [
    { header: "Khoản", key: "name", width: 25 },
    { header: "Số lượng", key: "qty", width: 15 },
    { header: "Đơn giá", key: "price", width: 15 },
    { header: "Thành tiền", key: "total", width: 20 },
  ];

  sheet.addRow({
    name: "Tiền phòng",
    qty: 1,
    price: roomPrice,
    total: roomPrice,
  });

  sheet.addRow({
    name: "Tiền điện",
    qty: electric,
    price: ELECTRIC_PRICE,
    total: electric * ELECTRIC_PRICE,
  });

  sheet.addRow({
    name: "Tiền nước",
    qty: water,
    price: WATER_PRICE,
    total: water * WATER_PRICE,
  });

  const total =
    roomPrice +
    electric * ELECTRIC_PRICE +
    water * WATER_PRICE;

  sheet.addRow({});
  sheet.addRow({
    name: "TỔNG",
    total: total,
  });

  // 👉 đảm bảo folder tồn tại
  const dir = "./invoices";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(
    dir,
    `invoice_${tenantName}_${Date.now()}.xlsx`
  );

  await workbook.xlsx.writeFile(filePath);

  return filePath;
};