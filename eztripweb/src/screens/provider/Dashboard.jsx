import { Chart as ChartJS, CategoryScale, LinearScale, LineController, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { useEffect, useRef, useState, useMemo } from "react";
import { Badge, Card, Col, Container, ProgressBar, Row, Form, Spinner } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";
import { formatCurrency } from "@utils/formatters";
import providerService from "@services/providerService";

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CURRENT_DATE = new Date();
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const CURRENT_MONTH = CURRENT_DATE.getMonth() + 1;

const extractChartConfig = (statsData, statType) => {
    if (!statsData) return { labels: [], dataPoints: [] };

    const typeMap = {
        DAY: { data: statsData.days, labelPrefix: "Ngày ", key: "day" },
        MONTH: { data: statsData.months, labelPrefix: "Tháng ", key: "month" },
        QUARTER: { data: statsData.quarters, labelPrefix: "Quý ", key: "quarter" },
    };

    const config = typeMap[statType];
    if (!config || !config.data) return { labels: [], dataPoints: [] };

    return {
        labels: config.data.map((item) => `${config.labelPrefix}${item[config.key]}`),
        dataPoints: config.data.map((item) => item.revenue),
    };
};

const StatCard = ({ title, value, textColorClass }) => (
    <Col xs={12} sm={6} lg={3}>
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex flex-column justify-content-between">
                <div className="text-secondary fw-semibold">{title}</div>
                <div className={`fs-1 fw-bold mt-3 ${textColorClass}`}>
                    {value || 0}
                </div>
            </Card.Body>
        </Card>
    </Col>
);

const ProgressRow = ({ label, value, total, variant }) => {
    const safeTotal = Math.max(1, total);
    const percentage = (value / safeTotal) * 100;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="fw-semibold">{label}</div>
                <Badge bg={variant}>{value}</Badge>
            </div>
            <ProgressBar variant={variant} now={percentage} />
        </div>
    );
};

const useDashboardStats = (statType, year, month) => {
    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const fetchStatistics = async () => {
            setIsLoading(true);
            try {
                const params = { statsType: statType, year };
                if (statType === "DAY") params.month = month;

                const response = await providerService.getStatistics(params);
                if (isMounted) setStatsData(response);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thống kê:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchStatistics();
        return () => { isMounted = false; };
    }, [statType, year, month]);

    return { statsData, isLoading };
};

function Dashboard() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [statType, setStatType] = useState("MONTH");
    const [year, setYear] = useState(CURRENT_YEAR);
    const [month, setMonth] = useState(CURRENT_MONTH);

    const { statsData, isLoading } = useDashboardStats(statType, year, month);

    const chartConfig = useMemo(() => extractChartConfig(statsData, statType), [statsData, statType]);

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
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [chartConfig, isLoading]);

    const totalBookings = statsData
        ? (statsData.totalConfirmedBooking || 0) + 
          (statsData.totalCompletedBooking || 0) + 
          (statsData.totalCancelledBooking || 0)
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
                            <StatCard title="Tổng số Dịch vụ" value={statsData?.totalService} textColorClass="text-primary" />
                            <StatCard title="Booking Đã xác nhận" value={statsData?.totalConfirmedBooking} textColorClass="text-info" />
                            <StatCard title="Booking Đã hoàn thành" value={statsData?.totalCompletedBooking} textColorClass="text-success" />
                            <StatCard title="Booking Đã hủy" value={statsData?.totalCancelledBooking} textColorClass="text-danger" />
                        </Row>

                        <Row className="g-3 mb-4">
                            <Col xs={12} lg={8}>
                                <div className="d-flex gap-2 mb-3">
                                    <Form.Select
                                        value={statType}
                                        onChange={(e) => setStatType(e.target.value)}
                                        className="bg-light border-0 shadow-sm w-auto"
                                    >
                                        <option value="DAY">Theo ngày</option>
                                        <option value="MONTH">Theo tháng</option>
                                        <option value="QUARTER">Theo quý</option>
                                    </Form.Select>

                                    {statType === "DAY" && (
                                        <Form.Select
                                            value={month}
                                            onChange={(e) => setMonth(Number(e.target.value))}
                                            className="bg-light border-0 shadow-sm w-auto"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <option key={m} value={m}>Tháng {m}</option>
                                            ))}
                                        </Form.Select>
                                    )}

                                    <Form.Select
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="bg-light border-0 shadow-sm w-auto"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i).map((y) => (
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
                                <Card className="h-100 border-0 shadow-sm mb-3 mt-5 mt-lg-0">
                                    <Card.Body>
                                        <Card.Title className="fw-bold mb-4">Tỉ trọng trạng thái Booking</Card.Title>
                                        <div className="d-flex flex-column gap-4">
                                            <ProgressRow 
                                                label="Đã xác nhận" 
                                                value={statsData?.totalConfirmedBooking || 0} 
                                                total={totalBookings} 
                                                variant="info" 
                                            />
                                            <ProgressRow 
                                                label="Đã hoàn thành" 
                                                value={statsData?.totalCompletedBooking || 0} 
                                                total={totalBookings} 
                                                variant="success" 
                                            />
                                            <ProgressRow 
                                                label="Đã hủy" 
                                                value={statsData?.totalCancelledBooking || 0} 
                                                total={totalBookings} 
                                                variant="danger" 
                                            />
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