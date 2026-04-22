import { useApp } from "../context/AppContext";
import { Badge, Button, Card, CardBody, Divider, Field, Page, PageHeader, Row, Select } from "../ui/components";

export default function Settings() {
  const { theme, setTheme, lang, setLang, t } = useApp();

  return (
    <Page>
      <PageHeader
        title={t("settings")}
        subtitle="Tuỳ chỉnh giao diện và ngôn ngữ."
        actions={
          <Row>
            <Badge variant={theme === "dark" ? "warn" : "success"}>
              {theme === "dark" ? "Dark" : "Light"}
            </Badge>
            <Badge>{lang.toUpperCase()}</Badge>
          </Row>
        }
      />

      <Card>
        <CardBody>
          <Row>
            <div style={{ flex: "1 1 280px" }}>
              <Field label={t("appearance")} hint="Thay đổi theme sẽ áp dụng ngay lập tức.">
                <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">{t("light")}</option>
                  <option value="dark">{t("dark")}</option>
                </Select>
              </Field>
            </div>

            <div style={{ flex: "1 1 280px" }}>
              <Field label={t("language")} hint="Dùng cho menu, tiêu đề, nút bấm.">
                <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </Select>
              </Field>
            </div>
          </Row>

          <Divider />

          <Row style={{ justifyContent: "flex-end" }}>
            <Button
              variant="ghost"
              onClick={() => {
                setTheme("light");
                setLang("vi");
              }}
            >
              Reset mặc định
            </Button>
          </Row>
        </CardBody>
      </Card>
    </Page>
  );
}