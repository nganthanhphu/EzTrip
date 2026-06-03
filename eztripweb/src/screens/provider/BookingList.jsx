import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Alert, Container, Row, Col, Form, Badge, ProgressBar, Card } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Chart as ChartJS, CategoryScale, LinearScale, LineController, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import ProviderLayout from "@layouts/ProviderLayout";
import CardBookingItem from "@components/provider/CardBookingItem";
import MySpinner from "@components/common/MySpinner";
import providerService from "@services/providerService";
import { formatCurrency } from "@utils/formatters";
import useDebounce from "@hooks/useDebounce";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import { useLookupTables } from "@contexts/LookupTablesContext";

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function BookingList() {
    const { id } = useParams();

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

    const [customerName, setCustomerName] = useState("");
    const [status, setStatus] = useState("");

    const debouncedCustomerName = useDebounce(customerName);
    const debouncedStatus = useDebounce(status);
    
    const { lookupTables } = useLookupTables();
    const statusOptions = lookupTables.bookingStatuses || [];

    const fetchBookings = useCallback(
        (nextPage) => {
            const params = {
                serviceId: id,
                page: nextPage
            };

            if (debouncedCustomerName) params.customerName = debouncedCustomerName;
            if (debouncedStatus) params.status = debouncedStatus;

            return providerService.getBookings(params);
        },
        [id, debouncedCustomerName, debouncedStatus]
    );

    const {
        items: bookings,
        loading: loadingBookings,
        hasMore,
        loadMore,
        refetch,
    } = useInfiniteScrollList({
        queryKey: ["providerBookings", id, debouncedCustomerName, debouncedStatus],
        fetchPage: fetchBookings
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!id) return;
            setLoadingStats(true);
            setErrorStats("");
            try {
                const params = { statsType: statType, year, serviceId: id };
                if (statType === "DAY") params.month = month;

                const response = await providerService.getStatistics(params);
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
        if (chartInstance.current) chartInstance.current.destroy();

        chartInstance.current = new ChartJS(canvas, {
            type: "line",
            data: {
                labels: chartConfig.labels,
                datasets: [
                    {
                        label: "Doanh thu dịch vụ",
                        data: chartConfig.dataPoints,
                        borderColor: "#0d6efd",
                        backgroundColor: "rgba(13, 110, 253, 0.1)",
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
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        callbacks: { label: (ctx) => ` ${formatCurrency(ctx.parsed.y)}` },
                    },
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        border: { dash: [4, 4] },
                        grid: { color: "#e9ecef" },
                        ticks: { callback: (val) => formatCurrency(val) } 
                    },
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
            <Container className="py-4 py-lg-5 max-w-1200">
                <div className="d-flex flex-column gap-1 mb-4 pb-2 border-bottom">
                    <h2 className="fw-bolder text-dark mb-0">Chi tiết & Thống kê dịch vụ</h2>
                    <p className="text-muted fw-medium">Service ID: <Badge bg="secondary" className="fw-normal">{id}</Badge></p>
                </div>

                <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
                    <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 flex-wrap">
                            <h5 className="fw-bold text-primary mb-0">Hiệu suất kinh doanh</h5>
                            <div className="d-flex gap-2 bg-light p-1 rounded-3">
                                <Form.Select className="border-0 bg-transparent fw-medium shadow-none w-auto" value={statType} onChange={(e) => setStatType(e.target.value)} size="sm">
                                    <option value="DAY">Theo ngày</option>
                                    <option value="MONTH">Theo tháng</option>
                                    <option value="QUARTER">Theo quý</option>
                                </Form.Select>
                                {statType === "DAY" && (
                                    <Form.Select className="border-0 bg-transparent fw-medium shadow-none w-auto" value={month} onChange={(e) => setMonth(Number(e.target.value))} size="sm">
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={m}>Th. {m}</option>
                                        ))}
                                    </Form.Select>
                                )}
                                <Form.Select className="border-0 bg-transparent fw-medium shadow-none w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))} size="sm">
                                    {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>
                    </Card.Header>
                    
                    <Card.Body className="p-4">
                        {loadingStats ? (
                            <div className="py-5 d-flex justify-content-center"><MySpinner /></div>
                        ) : errorStats ? (
                            <Alert variant="danger" className="rounded-3 border-0">{errorStats}</Alert>
                        ) : statsData ? (
                            <Row className="g-5">
                                <Col xs={12} lg={8}>
                                    <div className="mb-4">
                                        <span className="text-muted fw-medium text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Tổng doanh thu kỳ</span>
                                        <h3 className="fw-black text-dark mt-1 mb-0">
                                            {formatCurrency(statsData.totalRevenue)}
                                        </h3>
                                    </div>
                                    <div style={{ height: 280, position: 'relative' }}>
                                        <canvas ref={chartRef} />
                                    </div>
                                </Col>
                                <Col xs={12} lg={4} className="d-flex flex-column justify-content-center">
                                    <div className="p-4 bg-light rounded-4 h-100 d-flex flex-column justify-content-center gap-4">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-end mb-2">
                                                <span className="fw-semibold text-secondary">Xác nhận</span>
                                                <span className="fw-bold fs-5 text-info">{statsData.totalConfirmedBooking}</span>
                                            </div>
                                            <ProgressBar variant="info" className="rounded-pill" style={{ height: '8px' }} now={(statsData.totalConfirmedBooking / Math.max(1, totalBookings)) * 100} />
                                        </div>
                                        <div>
                                            <div className="d-flex justify-content-between align-items-end mb-2">
                                                <span className="fw-semibold text-secondary">Hoàn thành</span>
                                                <span className="fw-bold fs-5 text-success">{statsData.totalCompletedBooking}</span>
                                            </div>
                                            <ProgressBar variant="success" className="rounded-pill" style={{ height: '8px' }} now={(statsData.totalCompletedBooking / Math.max(1, totalBookings)) * 100} />
                                        </div>
                                        <div>
                                            <div className="d-flex justify-content-between align-items-end mb-2">
                                                <span className="fw-semibold text-secondary">Đã hủy</span>
                                                <span className="fw-bold fs-5 text-danger">{statsData.totalCancelledBooking}</span>
                                            </div>
                                            <ProgressBar variant="danger" className="rounded-pill" style={{ height: '8px' }} now={(statsData.totalCancelledBooking / Math.max(1, totalBookings)) * 100} />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        ) : null}
                    </Card.Body>
                </Card>

                <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <h4 className="fw-bold mb-0">Danh sách Booking</h4>
                    
                    <div className="d-flex flex-column flex-sm-row gap-2" style={{ maxWidth: '600px', width: '100%' }}>
                        <Form.Control
                            type="text"
                            placeholder="🔍 Nhập tên khách hàng..."
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="border-0 bg-white shadow-sm rounded-3 py-2 px-3"
                        />
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border-0 bg-white shadow-sm rounded-3 py-2 px-3 fw-medium text-secondary"
                            style={{ minWidth: '180px' }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>

                {loadingBookings && !bookings.length ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={bookings.length}
                        next={loadMore}
                        hasMore={hasMore || false}
                        loader={<div className="py-4 d-flex justify-content-center"><MySpinner /></div>}
                    >
                        <div className="d-flex flex-column gap-3">
                            {bookings.map((item) => (
                                <div key={item.id} className="transition-hover">
                                    <CardBookingItem
                                        {...item}
                                        onUpdated={() => refetch()} 
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {!loadingBookings && bookings.length === 0 && (
                            <div className="py-5 text-center bg-white rounded-4 shadow-sm mt-3 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                                <span className="fs-3 mb-2">📭</span>
                                <p className="text-muted fw-medium mb-0">Chưa có booking nào phù hợp với tìm kiếm của bạn.</p>
                            </div>
                        )}
                    </InfiniteScroll>
                )}
            </Container>
        </ProviderLayout>
    );
}

export default BookingList;