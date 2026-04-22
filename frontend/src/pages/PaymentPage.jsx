import { useEffect, useMemo, useState } from "react";
import {
  getPayments,
  createBill,
  sendReminder,
  payBillApi,
  updateUsageApi,
  deletePaymentApi,
} from "../services/api";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Field,
  Input,
  Page,
  PageHeader,
  Pagination,
  Row,
} from "../ui/components";
import "./payment.css";

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [usage, setUsage] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    loadData();
  }, []);

  // ===== LOAD DATA =====
  const loadData = async () => {
    const data = await getPayments();
    setPayments(data);
  };

  // ===== ACTION =====
  const handleCreate = async () => {
    await createBill();
    alert("Tạo hóa đơn thành công");
    loadData();
  };

  const handleReminder = async () => {
    const res = await sendReminder();
    alert(`Đã gửi ${res.totalSent} email`);
  };

  const handlePay = async (id) => {
    await payBillApi(id);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      await deletePaymentApi(id);
      alert("Xóa hóa đơn thành công");
      loadData();
    }
  };

  // ===== SAVE ĐIỆN NƯỚC =====
  const handleSaveUsage = async (id) => {
    const data = usage[id];

    if (!data) {
      alert("Chưa nhập điện nước");
      return;
    }

    await updateUsageApi(id, {
      electricNumber: Number(data.electric || 0),
      waterNumber: Number(data.water || 0),
    });

    alert("Đã lưu điện nước");
    loadData();
  };

  const getStatusClass = (status) => {
    return status === "paid" ? "paid" : "pending";
  };

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p) => {
      const statusLabel = p?.status === "paid" ? "đã trả paid" : "chưa trả pending";
      const hay = [
        p?.roomId?.name,
        p?.tenantName,
        p?.month,
        p?.status,
        statusLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [payments, search]);

  const pagedPayments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  return (
    <Page>
      <PageHeader
        title="Hóa đơn"
        subtitle="Theo dõi, cập nhật điện nước, trạng thái thanh toán."
        actions={
          <Row>
            <Button variant="primary" onClick={handleCreate}>
              + Tạo hóa đơn
            </Button>
            <Button variant="ghost" onClick={handleReminder}>
              📧 Nhắc thanh toán
            </Button>
          </Row>
        }
      />

      <Card>
        <CardBody>
          <Field label="Tìm kiếm" hint="Tìm theo phòng, người thuê, tháng, trạng thái...">
            <Input
              placeholder="VD: P101, Nguyễn, 2026-04, pending..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="uiTableWrap">
            <table className="uiTable">
        <thead>
          <tr>
            <th>STT</th>
            <th>Phòng</th>
            <th>Người thuê</th>
            <th>Tháng</th>
            <th>Tiền phòng</th>
            <th>Điện / Nước</th>
            <th>Tổng</th>
            <th>QR</th>
            <th>Trạng thái</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pagedPayments.map((p, i) => {
            const electric =
              usage[p._id]?.electric ?? p.electricNumber ?? "";
            const water =
              usage[p._id]?.water ?? p.waterNumber ?? "";

            const total =
              p.amount +
              Number(electric || 0) * 3500 +
              Number(water || 0) * 15000;

            return (
              <tr key={p._id}>
                <td>{(page - 1) * pageSize + i + 1}</td>
                <td>{p.roomId?.name}</td>
                <td>{p.tenantName}</td>
                <td>{p.month}</td>

                {/* TIỀN PHÒNG */}
                <td>{p.amount.toLocaleString()} VNĐ</td>

                {/* INPUT ĐIỆN NƯỚC */}
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input
                      type="number"
                      placeholder="Điện"
                      value={electric}
                      onChange={(e) =>
                        setUsage({
                          ...usage,
                          [p._id]: {
                            ...usage[p._id],
                            electric: e.target.value,
                          },
                        })
                      }
                      style={{ width: 90 }}
                    />

                    <Input
                      type="number"
                      placeholder="Nước"
                      value={water}
                      onChange={(e) =>
                        setUsage({
                          ...usage,
                          [p._id]: {
                            ...usage[p._id],
                            water: e.target.value,
                          },
                        })
                      }
                      style={{ width: 90 }}
                    />
                  </div>
                </td>

                {/* TỔNG */}
                <td>
                  <b>{total.toLocaleString()} VNĐ</b>
                </td>

                {/* QR */}
                <td>
                  {p.qrCodeUrl && (
                    <img src={p.qrCodeUrl} alt="qr" width={60} />
                  )}
                </td>

                {/* STATUS */}
                <td>
                  {p.status === "paid" ? (
                    <Badge variant="success">Đã trả</Badge>
                  ) : (
                    <Badge variant="danger">Chưa trả</Badge>
                  )}
                </td>

                {/* ACTION */}
                <td>
                  <Button variant="ghost" onClick={() => handleSaveUsage(p._id)}>
                    💾 Lưu
                  </Button>

                  {p.status === "pending" && (
                    <Button variant="primary" onClick={() => handlePay(p._id)}>
                      ✅ Đã trả
                    </Button>
                  )}

                  <Button variant="danger" onClick={() => handleDelete(p._id)}>
                    🗑️ Xóa
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Pagination
            totalItems={filteredPayments.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[6]}
            itemLabel="hóa đơn"
          />
        </CardBody>
      </Card>
    </Page>
  );
}
