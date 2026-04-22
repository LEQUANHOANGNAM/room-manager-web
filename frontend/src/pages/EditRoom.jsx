import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRooms, updateRoomApi } from "../services/api";
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
} from "../ui/components";
import "./form.css";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  const [tenant, setTenant] = useState({
    name: "",
    phone: "",
    cccd: "",
    email: "",
    startDate: "",
    endDate: "",
    status: "staying", // ✅ FIX
  });

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const data = await getRooms();
      const room = data.find((r) => r._id === id);
      if (!room) return;

      setForm(room);
      setOldImages(room.images || []);

      setTenant({
        name: room.tenant?.name || "",
        phone: room.tenant?.phone || "",
        cccd: room.tenant?.cccd || "",
        email: room.tenant?.email || "",
        startDate: room.tenant?.startDate?.slice(0, 10) || "",
        endDate: room.tenant?.endDate?.slice(0, 10) || "",
        status: room.tenant?.status || "staying", // ✅ FIX
      });
    };

    fetchRoom();
  }, [id]);

  const handleRemoveImage = (url) => {
    setRemoveImages((prev) => [...prev, url]);
    setOldImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async () => {
    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("status", form.status);

    fd.append("tenantName", tenant.name);
    fd.append("tenantPhone", tenant.phone);
    fd.append("tenantCccd", tenant.cccd);
    fd.append("tenantEmail", tenant.email);
    fd.append("tenantStartDate", tenant.startDate);
    fd.append("tenantEndDate", tenant.endDate);
    fd.append("tenantStatus", tenant.status); // ✅ QUAN TRỌNG

    if (avatar) {
      fd.append("avatar", avatar);
    }

    for (let i = 0; i < images.length; i++) {
      fd.append("images", images[i]);
    }

    fd.append("removeImageUrls", JSON.stringify(removeImages));

    const res = await updateRoomApi(id, fd);

    if (res._id) {
      alert("Cập nhật thành công");
      navigate("/rooms");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <Page>
      <PageHeader
        title="Sửa phòng"
        subtitle="Cập nhật thông tin phòng, người thuê và hình ảnh."
        actions={
          <Row>
            <Button variant="ghost" onClick={() => navigate("/rooms")}>
              ⬅️ Danh sách
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </Row>
        }
      />

      <Card>
        <CardBody>
          <Row>
            <div style={{ flex: "1 1 320px" }}>
              <Field label="Tên phòng">
                <Input
                  placeholder="Tên phòng"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Giá (VNĐ)">
                <Input
                  placeholder="Giá"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Trạng thái">
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="empty">Còn trống</option>
                  <option value="full">Đã thuê</option>
                </Select>
              </Field>
            </div>
          </Row>

          <Divider />

          <h3 style={{ margin: 0 }}>👤 Người thuê</h3>
          <div style={{ height: 8 }} />

          <Row>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="Tên">
                <Input
                  placeholder="Tên"
                  value={tenant.name}
                  onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="SĐT">
                <Input
                  placeholder="SĐT"
                  value={tenant.phone}
                  onChange={(e) =>
                    setTenant({ ...tenant, phone: e.target.value })
                  }
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="Email">
                <Input
                  placeholder="Email"
                  value={tenant.email}
                  onChange={(e) =>
                    setTenant({ ...tenant, email: e.target.value })
                  }
                />
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Ngày nhận phòng">
                <Input
                  type="date"
                  value={tenant.startDate}
                  onChange={(e) =>
                    setTenant({ ...tenant, startDate: e.target.value })
                  }
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Ngày trả phòng">
                <Input
                  type="date"
                  value={tenant.endDate}
                  onChange={(e) =>
                    setTenant({ ...tenant, endDate: e.target.value })
                  }
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <Field label="Trạng thái">
                <Select
                  value={tenant.status}
                  onChange={(e) =>
                    setTenant({ ...tenant, status: e.target.value })
                  }
                >
                  <option value="staying">Đang thuê</option>
                  <option value="left">Đã rời</option>
                </Select>
              </Field>
            </div>
          </Row>

          <Row>
            <div style={{ flex: "1 1 280px" }}>
              <Field label="Avatar">
                <Input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
              </Field>
            </div>
            <div style={{ flex: "1 1 340px" }}>
              <Field label="Thêm hình ảnh mới">
                <Input type="file" multiple onChange={(e) => setImages(e.target.files)} />
              </Field>
            </div>
          </Row>

          <Divider />

          <h3 style={{ margin: "0 0 10px" }}>🖼️ Ảnh hiện tại</h3>
          <div className="image-grid">
            {oldImages.map((img, i) => (
              <div key={i} className="img-box">
                <img src={`http://localhost:5000${img}`} alt="" />
                <button onClick={() => handleRemoveImage(img)}>X</button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </Page>
  );
}