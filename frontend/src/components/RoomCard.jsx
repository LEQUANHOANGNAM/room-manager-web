import { useNavigate } from "react-router-dom";
import { deleteRoomApi } from "../services/api";
import "./roomCard.css";
import { Badge, Button } from "../ui/components";

export default function RoomCard({ room, onDelete }) {
  const navigate = useNavigate();

  // ❌ Xóa phòng
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa phòng này?");
    if (!confirmDelete) return;

    try {
      await deleteRoomApi(room._id);
      alert("Xóa thành công");
      onDelete();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa");
    }
  };

  // 🔥 LẤY ẢNH
  const imageUrl = room.images?.length
    ? `http://localhost:5000${room.images[0]}`
    : "https://via.placeholder.com/300";

  return (
    <div className="roomCard">
      {/* 🖼️ IMAGE */}
      <img src={imageUrl} alt="room" className="roomImg" />

      {/* HEADER */}
      <div className="roomCardHeader">
        <div className="roomName">{room.name}</div>

        {room.status === "empty" ? (
          <Badge variant="success">Còn trống</Badge>
        ) : (
          <Badge variant="danger">Đã thuê</Badge>
        )}
      </div>

      {/* BODY */}
      <div className="roomCardBody">
        <div>Giá: {room.price} VNĐ</div>
        <div>Điện: 3.500 VNĐ/kWh</div>
        <div>Nước: 15.000 VNĐ/m³</div>
      </div>

      {/* ACTION */}
      <div className="roomCardActions">
        <Button variant="ghost" onClick={() => navigate(`/rooms/${room._id}`)}>
          Xem
        </Button>

        <Button variant="ghost" onClick={() => navigate(`/rooms/${room._id}/edit`)}>
          Sửa
        </Button>

        <Button variant="danger" onClick={handleDelete}>
          Xóa
        </Button>
      </div>
    </div>
  );
}