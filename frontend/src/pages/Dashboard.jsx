import { useEffect, useState } from "react";
import { getRooms, getPayments } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardBody, Page, PageHeader } from "../ui/components";
import "./dashboard.css";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const roomData = await getRooms();
    const paymentData = await getPayments();

    setRooms(roomData);
    setPayments(paymentData);
  };

  // ===== STATS =====
  const totalRooms = rooms.length;
  const rentedRooms = rooms.filter(r => r.status === "full").length;
  const emptyRooms = rooms.filter(r => r.status === "empty").length;

  const pendingBills = payments.filter(p => p.status === "pending").length;

  const totalMoney = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  // ===== PIE DATA (ROOM) =====
  const roomChart = [
    { name: "Đã thuê", value: rentedRooms },
    { name: "Trống", value: emptyRooms },
  ];

  // ===== BAR DATA (PAYMENT BY MONTH) =====
  const groupByMonth = {};

  payments.forEach((p) => {
    if (!groupByMonth[p.month]) {
      groupByMonth[p.month] = 0;
    }
    if (p.status === "paid") {
      groupByMonth[p.month] += p.amount;
    }
  });

  const paymentChart = Object.keys(groupByMonth).map((month) => ({
    month,
    amount: groupByMonth[month],
  }));

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <Page>
      <PageHeader title="Dashboard" subtitle="Tổng quan phòng, hóa đơn và doanh thu." />

      {/* ===== CARDS ===== */}
      <div className="card-grid">
        <Card>
          <CardBody className="card">
            <h3>Tổng phòng</h3>
            <p>{totalRooms}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="card">
            <h3>Đã thuê</h3>
            <p>{rentedRooms}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="card">
            <h3>Phòng trống</h3>
            <p>{emptyRooms}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="card">
            <h3>Chưa thanh toán</h3>
            <p>{pendingBills}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="card money">
            <h3>Doanh thu</h3>
            <p>{totalMoney.toLocaleString()} VNĐ</p>
          </CardBody>
        </Card>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="chart-grid">
        
        {/* PIE CHART */}
        <Card>
          <CardBody className="chart-box">
            <h3>🏠 Tình trạng phòng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roomChart}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {roomChart.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* BAR CHART */}
        <Card>
          <CardBody className="chart-box">
            <h3>💰 Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentChart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
          </CardBody>
        </Card>

      </div>
    </Page>
  );
}