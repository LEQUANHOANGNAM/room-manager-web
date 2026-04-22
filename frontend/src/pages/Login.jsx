import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button, Card, CardBody, Field, Input, Page, PageHeader } from "../ui/components";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, t } = useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login({ email, password });
      const to = location.state?.from || "/";
      navigate(to);
    } catch (e) {
      alert(e?.message || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div style={{ width: 420, maxWidth: "92vw" }}>
        <Page>
          <PageHeader
            title={t("appTitle")}
            subtitle="Đăng nhập để tiếp tục quản lý."
          />

          <Card>
            <CardBody>
              <div style={{ display: "grid", gap: 10 }}>
                <Field label="Email">
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Mật khẩu">
                  <Input
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin();
                    }}
                  />
                </Field>

                <Button
                  variant="primary"
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                >
                  {loading ? "Đang đăng nhập..." : t("login")}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Page>
      </div>
    </div>
  );
}