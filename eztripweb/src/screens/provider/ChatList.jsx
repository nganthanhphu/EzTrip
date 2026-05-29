import { Container } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";

function ChatList() {
    return (
        <ProviderLayout>
            <Container className="py-4">
                <h1>Chat List</h1>
                <p>Manage your conversations with customers.</p>
            </Container>
        </ProviderLayout>
    );
}

export default ChatList;
