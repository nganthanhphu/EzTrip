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
import { useEffect, useRef, useState, useMemo } from "react";
import { Badge, Card, Col, Container, ProgressBar, Row, Form, Spinner } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";
import { formatCurrency } from "@utils/formatters";
import providerService from "@services/providerService";

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Dashboard() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const [statType, setStatType] = useState("MONTH");
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStatistics = async () => {
            setIsLoading(true);
            try {
                const params = { statsType: statType, year };
                if (statType === "DAY") {
                    params.month = month;
                }

                const response = await providerService.getStatistics(params);
                setStatsData(response);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thống kê:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatistics();
    }, [statType, year, month]);

    const chartConfig = useMemo(() => {
        if (!statsData) return { labels: [], dataPoints: [] };

        let labels = [];
        let dataPoints = [];

        if (statType === "DAY" && statsData.days) {
            labels = statsData.days.map((d) => `Ngày ${d.day}`);
            dataPoints = statsData.days.map((d) => d.revenue);
        } else if (statType === "MONTH" && statsData.months) {
            labels = statsData.months.map((m) => `Tháng ${m.month}`);
            dataPoints = statsData.months.map((m) => m.revenue);
        } else if (statType === "QUARTER" && statsData.quarters) {
            labels = statsData.quarters.map((q) => `Quý ${q.quarter}`);
            dataPoints = statsData.quarters.map((q) => q.revenue);
        }

        return { labels, dataPoints };
    }, [statsData, statType]);

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas || isLoading) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new ChartJS(canvas, {
            type: "line",
            data: {
                labels: chartConfig.labels,
                datasets: [
                    {
                        label: "Doanh thu",
                        data: chartConfig.dataPoints,
                        borderColor: "#0d6efd",
                        backgroundColor: "rgba(13, 110, 253, 0.15)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            },
            options: {
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
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartConfig, isLoading]);

    const totalBookings = statsData 
        ? statsData.totalConfirmedBooking + statsData.totalCompletedBooking + statsData.totalCancelledBooking 
        : 0;

    return (
        <ProviderLayout>
            <Container className="py-4">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        <Row className="g-3 mb-4">
                            <Col xs={12} sm={6} lg={3}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div className="text-secondary fw-semibold">Tổng số Dịch vụ</div>
                                        <div className="fs-1 fw-bold text-primary mt-3">
                                            {statsData?.totalService || 0}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} lg={3}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div className="text-secondary fw-semibold">Booking Đã xác nhận</div>
                                        <div className="fs-1 fw-bold text-info mt-3">
                                            {statsData?.totalConfirmedBooking || 0}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} lg={3}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div className="text-secondary fw-semibold">Booking Đã hoàn thành</div>
                                        <div className="fs-1 fw-bold text-success mt-3">
                                            {statsData?.totalCompletedBooking || 0}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} lg={3}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div className="text-secondary fw-semibold">Booking Đã hủy</div>
                                        <div className="fs-1 fw-bold text-danger mt-3">
                                            {statsData?.totalCancelledBooking || 0}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="g-3 mb-4">
                            <Col xs={12} lg={8}>
                                <div className="d-flex gap-2">
                                    <Form.Select 
                                        value={statType} 
                                        onChange={(e) => setStatType(e.target.value)}
                                        className="bg-light border-0 shadow-sm"
                                    >
                                        <option value="DAY">Theo ngày</option>
                                        <option value="MONTH">Theo tháng</option>
                                        <option value="QUARTER">Theo quý</option>
                                    </Form.Select>

                                    {statType === "DAY" && (
                                        <Form.Select 
                                            value={month} 
                                            onChange={(e) => setMonth(Number(e.target.value))}
                                            className="bg-light border-0 shadow-sm"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <option key={m} value={m}>Tháng {m}</option>
                                            ))}
                                        </Form.Select>
                                    )}

                                    <Form.Select 
                                        value={year} 
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="bg-light border-0 shadow-sm"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
                                            <option key={y} value={y}>Năm {y}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <Card.Title className="mb-1 fs-4 fw-bold">Biểu đồ doanh thu</Card.Title>
                                                <Card.Subtitle className="text-secondary">
                                                    Doanh thu theo {statType === "DAY" ? "ngày" : statType === "MONTH" ? "tháng" : "quý"}
                                                </Card.Subtitle>
                                            </div>
                                            <div className="text-md-end">
                                                <div className="text-secondary small">Tổng doanh thu kỳ này</div>
                                                <div className="fs-3 fw-bold text-success">
                                                    {formatCurrency(statsData?.totalRevenue || 0)}
                                                </div>
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
                                        <Card.Title className="fw-bold mb-3">Tỉ trọng trạng thái Booking</Card.Title>
                                        <div className="d-flex flex-column gap-3">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="fw-semibold">Đã xác nhận</div>
                                                    <Badge bg="info">{statsData?.totalConfirmedBooking || 0}</Badge>
                                                </div>
                                                <ProgressBar 
                                                    variant="info"
                                                    now={((statsData?.totalConfirmedBooking || 0) / Math.max(1, totalBookings)) * 100} 
                                                />
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="fw-semibold">Đã hoàn thành</div>
                                                    <Badge bg="success">{statsData?.totalCompletedBooking || 0}</Badge>
                                                </div>
                                                <ProgressBar 
                                                    variant="success"
                                                    now={((statsData?.totalCompletedBooking || 0) / Math.max(1, totalBookings)) * 100} 
                                                />
                                            </div>
                                            {/* Cancelled */}
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="fw-semibold">Đã hủy</div>
                                                    <Badge bg="danger">{statsData?.totalCancelledBooking || 0}</Badge>
                                                </div>
                                                <ProgressBar 
                                                    variant="danger"
                                                    now={((statsData?.totalCancelledBooking || 0) / Math.max(1, totalBookings)) * 100} 
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </ProviderLayout>
    );
}

export default Dashboard;