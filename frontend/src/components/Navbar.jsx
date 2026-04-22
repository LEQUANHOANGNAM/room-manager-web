import { useNavigate } from "react-router-dom";
import { getRooms } from "../services/api";
import "./navbar.css";

export default function Navbar({ setRooms, user }) {
  const navigate = useNavigate();

  // 🔥 BACK (có fallback)
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // 🔄 Load lại danh sách phòng
  const handleRefresh = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Lỗi khi load rooms:", err);
      alert("Không thể tải dữ liệu phòng");
    }
  };

  // ➕ Thêm phòng
  const handleCreate = () => {
    navigate("/create-room");
  };

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔐 Login
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="topbar">
      {/* 🔥 CLICK → QUAY LẠI */}
      <div className="topbarTitle" onClick={handleBack}>
        🏠 Quản lý nhà trọ
      </div>

      <div className="topbarActions">
        {/* ➕ Thêm phòng */}
        {user && (
          <button className="btn btnPrimary" onClick={handleCreate}>
            + Thêm phòng
          </button>
        )}

        {/* 🔄 Refresh */}
        <button className="btn btnBlue" onClick={handleRefresh}>
          Làm mới
        </button>

        {/* 🔐 Auth */}
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>👋 {user.name}</span>

            <button className="btn btnDanger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn btnGreen" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}