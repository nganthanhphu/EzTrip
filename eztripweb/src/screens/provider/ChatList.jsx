import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import ProviderLayout from "@layouts/ProviderLayout";
import { useAuth } from "@hooks/useAuth";
import FirebaseConfigs from "@configs/FirebaseConfigs";
import ModalChat from "@components/common/ModalChat";
import { formatTimestamp } from "@utils/formatters";

function getPartnerName(lastMessage, currentUserId) {
    if (!lastMessage) {
        return "Khách hàng";
    }

    if (String(lastMessage.senderId) === String(currentUserId)) {
        return lastMessage.recipientName || "Khách hàng";
    }

    return lastMessage.senderName || "Khách hàng";
}

function ChatList() {
    const { currentUser } = useAuth();
    const currentUserId = String(currentUser?.id || "").trim();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const app = useMemo(() => {
        if (!FirebaseConfigs.apiKey || !FirebaseConfigs.databaseURL) {
            return null;
        }

        if (getApps().length > 0) {
            return getApp();
        }

        return initializeApp(FirebaseConfigs);
    }, []);

    const database = useMemo(() => (app ? getDatabase(app) : null), [app]);

    useEffect(() => {
        if (!database) {
            return undefined;
        }

        if (!currentUserId) {
            setError("Không tìm thấy ID tài khoản provider.");
            setLoading(false);
            return undefined;
        }

        setLoading(true);
        setError("");

        const processRoom = (roomId, roomMessages) => {
            const messages = roomMessages ? Object.entries(roomMessages).map(([id, value]) => ({ id, ...value })) : [];
            if (!messages.length) return null;

            messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            const lastMessage = messages[messages.length - 1];

            const involved = messages.some(m => String(m.senderId) === String(currentUserId) || String(m.recipientId) === String(currentUserId));
            if (!involved) return null;

            const partnerUserId = String(lastMessage.senderId) === String(currentUserId) ? String(lastMessage.recipientId || "") : String(lastMessage.senderId || "");

            return {
                roomId,
                partnerUserId,
                partnerName: getPartnerName(lastMessage, currentUserId),
                latestText: lastMessage.text || "",
                latestTimestamp: lastMessage.timestamp || 0,
            };
        };

        const chatRootRef = ref(database, "chats");
        const unsubscribe = onValue(chatRootRef, (snapshot) => {
            const payload = snapshot.val() || {};
            const nextConversations = Object.entries(payload)
                .map(([roomId, roomMessages]) => processRoom(roomId, roomMessages))
                .filter(Boolean)
                .sort((l, r) => (r.latestTimestamp || 0) - (l.latestTimestamp || 0));

            setConversations(nextConversations);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [database, currentUserId]);

    return (
        <ProviderLayout>
            <Container className="py-4">
                <h1 className="h3 mb-2">Tin nhắn khách hàng</h1>
                <p className="text-muted mb-4">Danh sách hội thoại và tin nhắn gần nhất.</p>

                {error ? (
                    <Alert variant="warning">{error}</Alert>
                ) : null}

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : null}

                {!loading && !error && conversations.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center py-5 text-muted">
                            Chưa có hội thoại nào.
                        </Card.Body>
                    </Card>
                ) : null}

                {!loading && conversations.map((conversation) => (
                    <Card
                        key={conversation.roomId}
                        className="mb-3 border-0 shadow-sm"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedConversation(conversation)}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start gap-3">
                                <div>
                                    <div className="fw-semibold">{conversation.partnerName}</div>
                                    <div className="text-muted mt-1">{conversation.latestText || "(Không có nội dung)"}</div>
                                </div>
                                <div className="text-muted small text-nowrap">
                                    {formatTimestamp(conversation.latestTimestamp)}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}

                <ModalChat
                    show={Boolean(selectedConversation)}
                    onHide={() => setSelectedConversation(null)}
                    currentUserId={currentUserId}
                    partnerUserId={selectedConversation?.partnerUserId || ""}
                    roomId={selectedConversation?.roomId || ""}
                    currentName={currentUser?.name || currentUser?.fullname || "Tôi"}
                    partnerName={selectedConversation?.partnerName || "Khách hàng"}
                    currentAvatar={currentUser?.avatar || ""}
                />
            </Container>
        </ProviderLayout>
    );
}

export default ChatList;
