import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRooms } from "../services/api";
import { Badge, Button, Card, CardBody, Divider, Page, PageHeader, Row } from "../ui/components";
import "./form.css";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const data = await getRooms();
      const found = data.find((r) => r._id === id);
      setRoom(found);
    };

    fetchRoom();
  }, [id]);

  if (!room) return <div>Đang tải...</div>;

  const statusBadge =
    room.status === "full"
      ? { variant: "danger", label: "Đã thuê" }
      : room.status === "empty"
      ? { variant: "success", label: "Còn trống" }
      : { variant: "warn", label: "Bảo trì" };

  return (
    <Page>
      <PageHeader
        title={room.name}
        subtitle="Chi tiết phòng, người thuê và hình ảnh."
        actions={
          <Row>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            <Button variant="ghost" onClick={() => navigate("/rooms")}>
              ⬅️ Danh sách
            </Button>
            <Button variant="primary" onClick={() => navigate(`/rooms/${id}/edit`)}>
              ✏️ Sửa
            </Button>
          </Row>
        }
      />

      <Card>
        <CardBody>
          <div style={{ lineHeight: "28px" }}>
            <div>
              <strong>💰 Giá:</strong> {room.price.toLocaleString()} VNĐ
            </div>
            <div>
              <strong>🏢 Toà:</strong> {room.building || "—"}
            </div>
            <div>
              <strong>🏢 Tầng:</strong> {room.floor ?? "—"}
            </div>
            <div>
              <strong>📝 Mô tả:</strong> {room.description || "Không có"}
            </div>
          </div>

          <Divider />

          <h3 style={{ margin: "0 0 8px" }}>👤 Người thuê</h3>
          {room.tenant?.name ? (
            <div style={{ lineHeight: "26px" }}>
              <div>
                <strong>Tên:</strong> {room.tenant.name}
              </div>
              <div>
                <strong>SĐT:</strong> {room.tenant.phone || "—"}
              </div>
              <div>
                <strong>CCCD:</strong> {room.tenant.cccd || "—"}
              </div>
              <div style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                <strong>Email:</strong> {room.tenant.email || "—"}
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>Chưa có người thuê</div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 style={{ margin: "0 0 10px" }}>📸 Hình ảnh</h3>
          <div className="image-grid">
            {room.images?.length > 0 ? (
              room.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${img}`}
                  alt=""
                  className="detail-img"
                />
              ))
            ) : (
              <p>Không có ảnh</p>
            )}
          </div>
        </CardBody>
      </Card>
    </Page>
  );
}