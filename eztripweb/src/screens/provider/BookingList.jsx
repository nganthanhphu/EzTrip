import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";
import CardBookingItem from "@components/provider/CardBookingItem";
import MySpinner from "@components/common/MySpinner";
import { getBookings } from "@services/providerService";

function BookingList() {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadBookings = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getBookings({ serviceId: id });
            setBookings(response || []);
        } catch (requestError) {
            setBookings([]);
            setError(requestError?.response?.data?.error || "Không thể tải danh sách booking.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            void loadBookings();
        } else {
            setBookings([]);
            setLoading(false);
        }
    }, [id, loadBookings]);

    return (
        <ProviderLayout>
            <Container className="py-4">
                <div className="d-flex flex-column gap-2 mb-4">
                    <h1 className="mb-0">Danh sách booking</h1>
                    <div className="text-secondary">Service ID: {id}</div>
                </div>

                {loading ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="mb-0">
                        {error}
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
                    <div className="py-5 text-center text-secondary">Chưa có booking nào cho service này.</div>
                )}
            </Container>
        </ProviderLayout>
    );
}

export default BookingList;