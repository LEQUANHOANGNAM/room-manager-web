import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import "./layout.css";
import { Button } from "../ui/components";
import { FaBars } from "react-icons/fa";

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, authLoading, logout, t } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        <div className="navbar">
          <div className="nav-left">
            <button
              className="navHamburger"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
            <h2 className="navTitle">🏠 {t("appTitle")}</h2>
          </div>

          <div className="nav-right">
            {!authLoading && !user && (
              <Button variant="primary" onClick={() => navigate("/login")}>
                {t("login")}
              </Button>
            )}

            {!authLoading && user && (
              <>
                <span>
                  {t("hi")} {user.name}
                </span>

                <Button variant="ghost" onClick={() => navigate("/create-room")}>
                  {t("addRoom")}
                </Button>

                <Button
                  variant="danger"
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                >
                  {t("logout")}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}