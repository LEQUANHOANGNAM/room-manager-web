import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoomApi } from "../services/api";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Field,
  Input,
  Page,
  PageHeader,
  Row,
  Select,
  Textarea,
} from "../ui/components";
import "./form.css";

export default function CreateRoom() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    roomNumber: "",
    floor: "",
    building: "",
    price: "",
    status: "empty",
    description: "",
  });

  const [tenant, setTenant] = useState({
    name: "",
    phone: "",
    cccd: "",
    email: "",
    startDate: "",
    endDate: "",
    status: "staying",
  });

  const [images, setImages] = useState([]);
  const [avatar, setAvatar] = useState(null); // ✅ FIX

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      alert("Nhập tên phòng và giá!");
      return;
    }

    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    fd.set("price", Number(form.price));

    // ✅ TENANT
    fd.append("tenantName", tenant.name);
    fd.append("tenantPhone", tenant.phone);
    fd.append("tenantCccd", tenant.cccd);
    fd.append("tenantEmail", tenant.email);
    fd.append("tenantStartDate", tenant.startDate);
    fd.append("tenantEndDate", tenant.endDate);
    fd.append("tenantStatus", tenant.status);

    // ✅ AVATAR (QUAN TRỌNG)
    if (avatar) {
      fd.append("avatar", avatar);
    }

    // ✅ IMAGES
    for (let i = 0; i < images.length; i++) {
      fd.append("images", images[i]);
    }

    try {
      const res = await createRoomApi(fd);

      if (res._id) {
        alert("Tạo thành công");
        navigate("/rooms");
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  return (
    <Page>
      <PageHeader
        title="Thêm phòng"
        subtitle="Tạo mới phòng và (tuỳ chọn) nhập thông tin người thuê."
        actions={
          <Row>
            <Button variant="ghost" onClick={() => navigate("/rooms")}>
              ⬅️ Danh sách
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Lưu
            </Button>
          </Row>
        }
      />

      <Card>
        <CardBody>
          <Row>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="Tên phòng">
                <Input name="name" placeholder="VD: Phòng 101" onChange={handleChange} />
              </Field>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <Field label="Số phòng">
                <Input name="roomNumber" placeholder="101" onChange={handleChange} />
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 160px" }}>
              <Field label="Tầng">
                <Input name="floor" placeholder="1" onChange={handleChange} />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Tòa">
                <Input name="building" placeholder="A" onChange={handleChange} />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Giá (VNĐ)">
                <Input name="price" placeholder="3000000" onChange={handleChange} />
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Trạng thái">
                <Select name="status" onChange={handleChange} defaultValue="empty">
                  <option value="empty">Còn trống</option>
                  <option value="full">Đã thuê</option>
                </Select>
              </Field>
            </div>
            <div style={{ flex: "2 1 360px" }}>
              <Field label="Mô tả">
                <Textarea name="description" placeholder="Ghi chú..." onChange={handleChange} />
              </Field>
            </div>
          </Row>

          <Divider />

          <h3 style={{ margin: 0 }}>👤 Người thuê</h3>
          <div style={{ height: 8 }} />

          <Row>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="Tên">
                <Input placeholder="Nguyễn Văn A" onChange={(e) => setTenant({ ...tenant, name: e.target.value })} />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="SĐT">
                <Input placeholder="09..." onChange={(e) => setTenant({ ...tenant, phone: e.target.value })} />
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="CCCD">
                <Input placeholder="..." onChange={(e) => setTenant({ ...tenant, cccd: e.target.value })} />
              </Field>
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="Email">
                <Input type="email" placeholder="..." onChange={(e) => setTenant({ ...tenant, email: e.target.value })} />
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Ngày nhận phòng">
                <Input type="date" onChange={(e) => setTenant({ ...tenant, startDate: e.target.value })} />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Ngày trả phòng">
                <Input type="date" onChange={(e) => setTenant({ ...tenant, endDate: e.target.value })} />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Trạng thái">
                <Select onChange={(e) => setTenant({ ...tenant, status: e.target.value })} defaultValue="staying">
                  <option value="staying">Đang thuê</option>
                  <option value="left">Đã rời</option>
                </Select>
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="Avatar người thuê">
                <Input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && !file.type.startsWith('image/')) {
                    alert('Chỉ cho phép file ảnh!');
                    return;
                  }
                  setAvatar(file);
                }} />
              </Field>
            </div>
            <div style={{ flex: "1 1 320px" }}>
              <Field label="Hình ảnh phòng">
                <Input type="file" multiple accept="image/*" onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const invalid = files.filter(f => !f.type.startsWith('image/'));
                  if (invalid.length > 0) {
                    alert('Chỉ cho phép file ảnh!');
                    return;
                  }
                  setImages(files);
                }} />
              </Field>
            </div>
          </Row>
        </CardBody>
      </Card>
    </Page>
  );
}