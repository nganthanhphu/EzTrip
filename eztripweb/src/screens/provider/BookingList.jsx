import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Container, Row, Col, Form, Badge, ProgressBar } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
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
import useDebounce from "@hooks/useDebounce";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import { useLookupTables } from "@contexts/LookupTablesContext";

ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function BookingList() {
    const { id } = useParams();
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

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

    const [customerName, setCustomerName] = useState(searchParams.get("customerName") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");

    const debouncedCustomerName = useDebounce(customerName);
    const debouncedStatus = useDebounce(status);
    
    const { lookupTables } = useLookupTables();
    const statusOptions = lookupTables.bookingStatuses || [];
    const pageSize = 5;

    // --- Cập nhật URL Query Parameters (Tham số truy vấn) khi filter thay đổi ---
    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const nextCustomerName = debouncedCustomerName.trim();
        const nextStatus = debouncedStatus.trim();

        if (nextCustomerName) params.set("customerName", nextCustomerName); else params.delete("customerName");
        if (nextStatus) params.set("status", nextStatus); else params.delete("status");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            nav({ pathname: window.location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
        }
    }, [debouncedCustomerName, debouncedStatus, searchParamsString, nav]);

    const fetchBookings = useCallback(
        (nextPage) => {
            const params = {
                serviceId: id,
                page: nextPage,
                size: pageSize,
            };

            if (debouncedCustomerName) params.customerName = debouncedCustomerName;
            if (debouncedStatus) params.status = debouncedStatus;

            return getBookings(params).then((response) => {
                if (Array.isArray(response)) return response;
                return response?.content || response?.items || response?.results || [];
            });
        },
        [id, debouncedCustomerName, debouncedStatus, pageSize]
    );

    const {
        items: bookings,
        loading: loadingBookings,
        loadingMore,
        hasMore,
        loadMore,
        refetch,
    } = useInfiniteScrollList({
        queryKey: ["providerBookings", id, debouncedCustomerName, debouncedStatus, pageSize],
        fetchPage: fetchBookings,
        pageSize,
    });

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
        if (chartInstance.current) chartInstance.current.destroy();

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
                <Form className="mb-4">
                    <Row className="g-3 align-items-center">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Tên khách hàng"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>

                {loadingBookings && !bookings.length ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        initialLoad={false}
                        threshold={250}
                    >
                        <div className="d-flex flex-column gap-3">
                            {bookings.map((item) => (
                                <CardBookingItem
                                    key={item.id}
                                    {...item}
                                    onUpdated={() => refetch()} 
                                />
                            ))}
                        </div>
                        
                        {!loadingBookings && bookings.length === 0 && (
                            <div className="py-5 text-center text-secondary bg-light rounded border-dashed mt-3">
                                Chưa có booking nào phù hợp với tìm kiếm.
                            </div>
                        )}

                        {loadingMore && (
                            <div className="py-4 d-flex justify-content-center">
                                <MySpinner />
                            </div>
                        )}
                    </InfiniteScroll>
                )}
            </Container>
        </ProviderLayout>
    );
}

export default BookingList;