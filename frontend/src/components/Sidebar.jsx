import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaDoorOpen,
  FaFileInvoice,
  FaUsers,
  FaCog,
  FaRobot,
} from "react-icons/fa";
import { useApp } from "../context/AppContext";
import "./sidebar.css"; // 🔥 đảm bảo có dòng này

export default function Sidebar({ open = false, onClose }) {
  const navigate = useNavigate();
  const { t } = useApp();

  const handleBack = () => {
    // Hợp lý nhất: đưa về Dashboard
    navigate("/");
    onClose?.();
  };

  return (
    <>
      {/* overlay (mobile) */}
      <div
        className={`sidebarOverlay ${open ? "isOpen" : ""}`}
        onClick={() => onClose?.()}
      />

      <aside className={`sidebar ${open ? "isOpen" : ""}`}>
        <div className="sidebarHeader">
          <div className="sidebarTitle" onClick={handleBack}>
            {t("appTitle")}
          </div>
        </div>

        <ul className="sidebarNav">
          <li className="sidebarItem">
            <NavLink to="/" end onClick={() => onClose?.()}>
              <FaHome /> <span>{t("home")}</span>
            </NavLink>
          </li>

          <li className="sidebarItem">
            <NavLink to="/rooms" onClick={() => onClose?.()}>
              <FaDoorOpen /> <span>{t("rooms")}</span>
            </NavLink>
          </li>

          <li className="sidebarItem">
            <NavLink to="/payments" onClick={() => onClose?.()}>
              <FaFileInvoice /> <span>{t("payments")}</span>
            </NavLink>
          </li>

          <li className="sidebarItem">
            <NavLink to="/tenants" onClick={() => onClose?.()}>
              <FaUsers /> <span>{t("tenants")}</span>
            </NavLink>
          </li>

          <li className="sidebarItem">
            <NavLink to="/settings" onClick={() => onClose?.()}>
              <FaCog /> <span>{t("settings")}</span>
            </NavLink>
          </li>

          <li className="sidebarItem">
            <NavLink to="/chat" onClick={() => onClose?.()}>
              <FaRobot /> <span>Chat Hỗ Trợ</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
}