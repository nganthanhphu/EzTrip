import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineController,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useEffect, useRef } from "react";
import { Badge, Card, Col, Container, ProgressBar, Row, Table } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";
import { formatCurrency } from "@utils/formatters";

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const summaryCards = [
    { label: "Tổng dịch vụ", value: 8, tone: "primary" },
    { label: "Tổng lượt booking", value: 512, tone: "success" },
    { label: "Đang phục vụ", value: 12, tone: "warning" },
    { label: "Đã hoàn thành", value: 500, tone: "info" },
];

const revenueData = [
    { month: "T1", revenue: 120000000 },
    { month: "T2", revenue: 180000000 },
    { month: "T3", revenue: 150000000 },
    { month: "T4", revenue: 220000000 },
    { month: "T5", revenue: 410000000 },
    { month: "T6", revenue: 280000000 },
    { month: "T7", revenue: 320000000 },
    { month: "T8", revenue: 560000000 },
    { month: "T9", revenue: 390000000 },
    { month: "T10", revenue: 430000000 },
    { month: "T11", revenue: 720000000 },
    { month: "T12", revenue: 610000000 },
];

const servicesOverview = [
    { name: "Phòng VIP", bookings: 126, status: "Đang phục vụ", revenue: 360000000, completionRate: 94 },
    { name: "Tour Sài Gòn 3N2Đ", bookings: 84, status: "Hoàn thành", revenue: 280000000, completionRate: 89 },
    { name: "Vé xe liên tỉnh", bookings: 152, status: "Hoàn thành", revenue: 190000000, completionRate: 97 },
    { name: "Combo nghỉ dưỡng", bookings: 58, status: "Đang phục vụ", revenue: 145000000, completionRate: 81 },
];

const statusBreakdown = [
    { label: "Đang phục vụ", value: 12, tone: "warning" },
    { label: "Đã hoàn thành", value: 500, tone: "success" },
    { label: "Đã hủy", value: 18, tone: "danger" },
];

const revenueChartData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
        {
            label: "Doanh thu",
            data: revenueData.map((item) => item.revenue),
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, 0.15)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
        },
    ],
};

const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context) => formatCurrency(context.parsed.y),
            },
        },
    },
    scales: {
        y: {
            ticks: { callback: (value) => formatCurrency(value) },
            grid: { color: "rgba(0,0,0,0.06)" },
        },
        x: { grid: { display: false } },
    },
};

function Dashboard() {
    const chartRef = useRef(null);
    const totalRevenue = revenueData.reduce((s, i) => s + i.revenue, 0);
    const totalBookings = summaryCards[1].value;

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas) return;
        const existing = ChartJS.getChart(canvas);
        if (existing) existing.destroy();
        const chart = new ChartJS(canvas, { type: "line", data: revenueChartData, options: revenueChartOptions });
        return () => chart.destroy();
    }, []);

    return (
        <ProviderLayout>
            <Container className="py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
                    <div>
                        <h1 className="mb-1 fw-bold">Dashboard nhà cung cấp</h1>
                        <div className="text-secondary">Thống kê tổng quan (theo service) cho một nhà cung cấp</div>
                    </div>
                    <Badge bg="dark" className="rounded-pill px-3 py-2">Hôm nay: 27/05/2026</Badge>
                </div>

                <Row className="g-3 mb-4">
                    {summaryCards.map((c) => (
                        <Col key={c.label} xs={12} sm={6} lg={3}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div className="text-secondary fw-semibold">{c.label}</div>
                                    <div className="d-flex align-items-end justify-content-between mt-3">
                                        <div className={`fs-1 fw-bold text-${c.tone}`}>{c.value}</div>
                                        <Badge bg={c.tone} className="rounded-pill px-3 py-2">Mock data</Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="g-3 mb-4">
                    <Col xs={12} lg={8}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <Card.Title className="mb-1 fs-4 fw-bold">Doanh thu</Card.Title>
                                        <Card.Subtitle className="text-secondary">Doanh thu theo tháng (tổng service)</Card.Subtitle>
                                    </div>
                                    <div className="text-md-end">
                                        <div className="text-secondary small">Tổng doanh thu</div>
                                        <div className="fs-3 fw-bold text-success">{formatCurrency(totalRevenue)}</div>
                                    </div>
                                </div>
                                <div style={{ height: 360 }}>
                                    <canvas ref={chartRef} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} lg={4}>
                        <Card className="h-100 border-0 shadow-sm mb-3">
                            <Card.Body>
                                <Card.Title className="fw-bold mb-3">Tình trạng booking</Card.Title>
                                <div className="d-flex flex-column gap-3">
                                    {statusBreakdown.map((s) => (
                                        <div key={s.label}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <div className="fw-semibold">{s.label}</div>
                                                <Badge bg={s.tone}>{s.value} booking</Badge>
                                            </div>
                                            <ProgressBar now={(s.value / Math.max(1, totalBookings)) * 100} label={`${Math.round((s.value / Math.max(1, totalBookings)) * 100)}%`} />
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm mt-4">
                    <Card.Body>
                        <Card.Title className="fw-bold mb-3">Tổng quan vận hành</Card.Title>
                        <Row className="g-3">
                            <Col xs={12} md={4}>
                                <div className="p-3 rounded border bg-light h-100">
                                    <div className="text-secondary mb-1">Số booking đang phục vụ</div>
                                    <div className="fs-2 fw-bold text-warning">{summaryCards[2].value}</div>
                                </div>
                            </Col>
                            <Col xs={12} md={4}>
                                <div className="p-3 rounded border bg-light h-100">
                                    <div className="text-secondary mb-1">Số booking đã hoàn thành</div>
                                    <div className="fs-2 fw-bold text-success">{summaryCards[3].value}</div>
                                </div>
                            </Col>
                            <Col xs={12} md={4}>
                                <div className="p-3 rounded border bg-light h-100">
                                    <div className="text-secondary mb-1">Tổng doanh thu</div>
                                    <div className="fs-2 fw-bold text-primary">{formatCurrency(totalRevenue)}</div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </ProviderLayout>
    );
}

export default Dashboard;
