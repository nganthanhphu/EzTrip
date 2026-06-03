import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import ProviderLayout from "@layouts/ProviderLayout";
import { useAuth } from "@hooks/useAuth";
import FirebaseConfigs from "@configs/FirebaseConfigs";
import ModalChat from "@components/common/ModalChat";
import { formatTimestamp } from "@utils/formatters";

const getPartnerName = (lastMessage, currentUserId) => {
    if (!lastMessage) return "Khách hàng";
    return String(lastMessage.senderId) === String(currentUserId)
        ? lastMessage.recipientName || "Khách hàng"
        : lastMessage.senderName || "Khách hàng";
};

const parseConversations = (payload, currentUserId) => {
    if (!payload) return [];

    return Object.entries(payload)
        .reduce((acc, [roomId, roomMessages]) => {
            const messages = Object.values(roomMessages || {});
            if (!messages.length) return acc;

            messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            const lastMessage = messages[messages.length - 1];

            const involved = messages.some(
                (m) =>
                    String(m.senderId) === currentUserId ||
                    String(m.recipientId) === currentUserId,
            );

            if (involved) {
                acc.push({
                    roomId,
                    partnerUserId:
                        String(lastMessage.senderId) === currentUserId
                            ? String(lastMessage.recipientId || "")
                            : String(lastMessage.senderId || ""),
                    partnerName: getPartnerName(lastMessage, currentUserId),
                    latestText: lastMessage.text || "",
                    latestTimestamp: lastMessage.timestamp || 0,
                });
            }
            return acc;
        }, [])
        .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
};

const useFirebaseChats = (currentUserId) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const database = useMemo(() => {
        if (!FirebaseConfigs.apiKey || !FirebaseConfigs.databaseURL) return null;
        const app = getApps().length > 0 ? getApp() : initializeApp(FirebaseConfigs);
        return getDatabase(app);
    }, []);

    useEffect(() => {
        if (!database) {
            setLoading(false);
            return;
        }

        if (!currentUserId) {
            setError("Không tìm thấy ID tài khoản provider.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        const chatRootRef = ref(database, "chats");
        const unsubscribe = onValue(
            chatRootRef,
            (snapshot) => {
                const nextConversations = parseConversations(snapshot.val(), currentUserId);
                setConversations(nextConversations);
                setLoading(false);
            },
            (err) => {
                setError("Lỗi khi tải tin nhắn: " + err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [database, currentUserId]);

    return { conversations, loading, error };
};

function ChatList() {
    const { currentUser } = useAuth();
    const currentUserId = String(currentUser?.id || "").trim();
    const { conversations, loading, error } = useFirebaseChats(currentUserId);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" role="status" />
                </div>
            );
        }

        if (error) {
            return <Alert variant="warning">{error}</Alert>;
        }

        if (conversations.length === 0) {
            return (
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5 text-muted">
                        Chưa có hội thoại nào.
                    </Card.Body>
                </Card>
            );
        }

        return conversations.map((conversation) => (
            <Card
                key={conversation.roomId}
                className="mb-3 border-0 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedConversation(conversation)}
            >
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                            <div className="fw-semibold">
                                {conversation.partnerName}
                            </div>
                            <div className="text-muted mt-1">
                                {conversation.latestText || "(Không có nội dung)"}
                            </div>
                        </div>
                        <div className="text-muted small text-nowrap">
                            {formatTimestamp(conversation.latestTimestamp)}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        ));
    };

    return (
        <ProviderLayout>
            <Container className="py-4">
                <h1 className="h3 mb-2">Tin nhắn khách hàng</h1>
                <p className="text-muted mb-4">
                    Danh sách hội thoại và tin nhắn gần nhất.
                </p>

                {renderContent()}

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