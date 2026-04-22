import { useEffect, useMemo, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getRooms } from "../services/api";
import { Card, CardBody, Field, Input, Page, PageHeader, Pagination } from "../ui/components";
import "./Room.css";

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const data = await getRooms();
    setRooms(data);
  };

  const filteredRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((room) => {
      const hay = [
        room?.name,
        room?.roomNumber,
        room?.building,
        room?.floor,
        room?.status,
        room?.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rooms, search]);

  const pagedRooms = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRooms.slice(start, start + pageSize);
  }, [filteredRooms, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  return (
    <Page>
      <PageHeader title="Danh sách phòng" subtitle="Tìm kiếm, quản lý và xem chi tiết từng phòng." />

      <Card>
        <CardBody>
          <Field label="Tìm phòng">
            <Input
              className="search"
              type="text"
              placeholder="Nhập tên phòng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
        </CardBody>
      </Card>

      <div className="roomGrid">
        {pagedRooms.map((room) => (
          <RoomCard key={room._id} room={room} onDelete={fetchRooms} />
        ))}
      </div>

      <Card>
        <CardBody>
          <Pagination
            totalItems={filteredRooms.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[6]}
            itemLabel="phòng"
          />
        </CardBody>
      </Card>
    </Page>
  );
}