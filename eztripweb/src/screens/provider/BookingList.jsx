import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Alert, Container, Row, Col, Card, Form, Badge, ProgressBar } from "react-bootstrap";
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
import ProviderLayout from "@layouts/ProviderLayout";
import CardBookingItem from "@components/provider/CardBookingItem";
import MySpinner from "@components/common/MySpinner";
import { getBookings, getStatistics } from "@services/providerService";
import { formatCurrency } from "@utils/formatters";

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function BookingList() {
    const { id } = useParams();

    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [errorBookings, setErrorBookings] = useState("");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const [statType, setStatType] = useState("MONTH");
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    
    const [statsData, setStatsData] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [errorStats, setErrorStats] = useState("");

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const loadBookings = useCallback(async () => {
        setLoadingBookings(true);
        setErrorBookings("");
        try {
            const response = await getBookings({ serviceId: id });
            setBookings(response || []);
        } catch (requestError) {
            setBookings([]);
            setErrorBookings(requestError?.response?.data?.error || "Không thể tải danh sách booking.");
        } finally {
            setLoadingBookings(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            void loadBookings();
        } else {
            setBookings([]);
            setLoadingBookings(false);
        }
    }, [id, loadBookings]);

    useEffect(() => {
        const fetchStats = async () => {
            if (!id) return;
            setLoadingStats(true);
            setErrorStats("");
            try {
                const params = { statsType: statType, year, serviceId: id };
                if (statType === "DAY") params.month = month;

                const response = await getStatistics(params);
                setStatsData(response);
            } catch (error) {
                setErrorStats("Lỗi khi tải dữ liệu thống kê dịch vụ.");
            } finally {
                setLoadingStats(false);
            }
        };

        void fetchStats();
    }, [id, statType, year, month]);

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
        if (!canvas || loadingStats) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new ChartJS(canvas, {
            type: "line",
            data: {
                labels: chartConfig.labels,
                datasets: [
                    {
                        label: "Doanh thu dịch vụ",
                        data: chartConfig.dataPoints,
                        borderColor: "#198754",
                        backgroundColor: "rgba(25, 135, 84, 0.15)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) },
                    },
                },
                scales: {
                    y: { ticks: { callback: (val) => formatCurrency(val) } },
                    x: { grid: { display: false } },
                },
            }
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [chartConfig, loadingStats]);

    const totalBookings = statsData 
        ? statsData.totalConfirmedBooking + statsData.totalCompletedBooking + statsData.totalCancelledBooking 
        : 0;

    return (
        <ProviderLayout>
            <Container className="py-4">
                <div className="d-flex flex-column gap-2 mb-4">
                    <h1 className="mb-0">Chi tiết & Thống kê dịch vụ</h1>
                    <div className="text-secondary">Service ID: {id}</div>
                </div>

                <div className="mb-5 p-4 bg-white rounded shadow-sm border">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                        <h4 className="fw-bold mb-0">Hiệu suất kinh doanh</h4>
                        <div className="d-flex gap-2">
                            <Form.Select value={statType} onChange={(e) => setStatType(e.target.value)} size="sm">
                                <option value="DAY">Theo ngày</option>
                                <option value="MONTH">Theo tháng</option>
                                <option value="QUARTER">Theo quý</option>
                            </Form.Select>
                            {statType === "DAY" && (
                                <Form.Select value={month} onChange={(e) => setMonth(Number(e.target.value))} size="sm">
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                        <option key={m} value={m}>Th. {m}</option>
                                    ))}
                                </Form.Select>
                            )}
                            <Form.Select value={year} onChange={(e) => setYear(Number(e.target.value))} size="sm">
                                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>

                    {loadingStats ? (
                        <div className="py-4 d-flex justify-content-center"><MySpinner /></div>
                    ) : errorStats ? (
                        <Alert variant="warning">{errorStats}</Alert>
                    ) : statsData ? (
                        <Row className="g-4">
                            <Col xs={12} lg={8}>
                                <div className="text-secondary small mb-1">Tổng doanh thu kỳ:</div>
                                <div className="fs-4 fw-bold text-success mb-3">
                                    {formatCurrency(statsData.totalRevenue)}
                                </div>
                                <div style={{ height: 250 }}>
                                    <canvas ref={chartRef} />
                                </div>
                            </Col>
                            <Col xs={12} lg={4} className="d-flex flex-column justify-content-center gap-3">
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small className="fw-semibold">Xác nhận</small>
                                        <Badge bg="info">{statsData.totalConfirmedBooking}</Badge>
                                    </div>
                                    <ProgressBar variant="info" now={(statsData.totalConfirmedBooking / Math.max(1, totalBookings)) * 100} />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small className="fw-semibold">Hoàn thành</small>
                                        <Badge bg="success">{statsData.totalCompletedBooking}</Badge>
                                    </div>
                                    <ProgressBar variant="success" now={(statsData.totalCompletedBooking / Math.max(1, totalBookings)) * 100} />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small className="fw-semibold">Đã hủy</small>
                                        <Badge bg="danger">{statsData.totalCancelledBooking}</Badge>
                                    </div>
                                    <ProgressBar variant="danger" now={(statsData.totalCancelledBooking / Math.max(1, totalBookings)) * 100} />
                                </div>
                            </Col>
                        </Row>
                    ) : null}
                </div>

                <h4 className="fw-bold mb-3">Danh sách Booking chi tiết</h4>
                {loadingBookings ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : errorBookings ? (
                    <Alert variant="danger" className="mb-0">
                        {errorBookings}
                    </Alert>
                ) : bookings.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                        {bookings.map((item) => (
                            <CardBookingItem
                                key={item.id}
                                {...item}
                                onUpdated={loadBookings}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-5 text-center text-secondary bg-light rounded border-dashed">
                        Chưa có booking nào cho service này.
                    </div>
                )}
            </Container>
        </ProviderLayout>
    );
}

export default BookingList;