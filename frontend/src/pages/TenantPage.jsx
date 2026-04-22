import { useEffect, useMemo, useState } from "react";
import { getRooms } from "../services/api";
import { Card, CardBody, Field, Input, Page, PageHeader, Pagination } from "../ui/components";
import "./tenant.css";

export default function TenantPage() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const rooms = await getRooms();

    const tenantList = rooms
      .filter((r) => r.tenant && r.tenant.name)
      .map((r) => ({
        ...r.tenant,
        roomName: r.name,
        roomId: r._id, // 👈 thêm key ổn định
      }));

    setTenants(tenantList);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const filteredTenants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter((t) => {
      const hay = [
        t?.name,
        t?.roomName,
        t?.phone,
        t?.email,
        t?.cccd,
        t?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [tenants, search]);

  const pagedTenants = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTenants.slice(start, start + pageSize);
  }, [filteredTenants, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  return (
    <Page>
      <PageHeader title="Khách thuê" subtitle="Danh sách khách thuê hiện tại trong các phòng." />

      <Card>
        <CardBody>
          <Field label="Tìm kiếm" hint="Tìm theo tên, phòng, SĐT, email, CCCD...">
            <Input
              placeholder="Nhập từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
        </CardBody>
      </Card>

      <div className="tenant-grid">
        {pagedTenants.map((t) => (
          <Card className="tenant-card" key={t.roomId}>
            <CardBody>
              {/* AVATAR */}
              <img
                src={
                  t.avatar
                    ? `http://localhost:5000${t.avatar}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
              />

              <h3 style={{ margin: "8px 0 6px" }}>{t.name}</h3>

              <p>📍 Phòng: {t.roomName}</p>
              <p>📞 {t.phone || "—"}</p>
              <p>📧 {t.email || "—"}</p>

              <p>🏠 Nhận phòng: {formatDate(t.startDate)}</p>
              <p>🚪 Trả phòng: {formatDate(t.endDate)}</p>

              <p style={{ marginTop: 8, fontWeight: 800 }}>
                {t.status === "staying" ? "🟢 Đang thuê" : "🔴 Đã rời"}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody>
          <Pagination
            totalItems={filteredTenants.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[6]}
            itemLabel="khách"
          />
        </CardBody>
      </Card>
    </Page>
  );
}