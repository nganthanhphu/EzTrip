import { Container } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";

function Home() {
    return (
        <ProviderLayout>
            <Container className="py-4">
            <h1>Welcome to EzTrip Provider Portal</h1>
            <p>Manage your services and bookings efficiently.</p>
            </Container>
        </ProviderLayout>
    );
}

export default Home;