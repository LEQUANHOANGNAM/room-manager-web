import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import RequireAuth from "./routes/RequireAuth";

import Dashboard from "./pages/Dashboard";
import RoomPage from "./pages/RoomPage";
import PaymentPage from "./pages/PaymentPage";
import Login from "./pages/Login";
import CreateRoom from "./pages/CreateRoom";
import RoomDetail from "./pages/RoomDetail";
import EditRoom from "./pages/EditRoom";
import TenantPage from "./pages/TenantPage";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN riêng */}
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          {/* DÙNG CHUNG LAYOUT */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/rooms/:id/edit" element={<EditRoom />} />
            <Route path="/tenants" element={<TenantPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}