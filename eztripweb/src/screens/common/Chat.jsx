import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Badge, Card, Col, Container, Row } from "react-bootstrap";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, push, ref } from "firebase/database";
import FirebaseConfigs from "../../configs/FirebaseConfigs";
import { MessageBubble, ChatInput } from "@components/common/ChatComponents";
import defaultAvatar from "@assets/images/default_avatar.jpg";

const MOCK_USERS = {
    1: { id: "1", name: "User 1 (Khách hàng)", avatar: defaultAvatar },
    2: { id: "2", name: "User 2 (Nhà cung cấp)", avatar: defaultAvatar },
};

function Chat() {
    const { fromId, toId } = useParams();
    const normalizedFromId = String(fromId || "1");
    const normalizedToId = String(toId || "2");

    const roomId = useMemo(
        () => [normalizedFromId, normalizedToId].sort().join("__"),
        [normalizedFromId, normalizedToId],
    );

    const currentUser = useMemo(
        () =>
            MOCK_USERS[normalizedFromId] || {
                id: normalizedFromId,
                name: `User ${normalizedFromId}`,
                avatar: defaultAvatar,
            },
        [normalizedFromId],
    );
    const partnerUser = useMemo(
        () =>
            MOCK_USERS[normalizedToId] || {
                id: normalizedToId,
                name: `User ${normalizedToId}`,
                avatar: defaultAvatar,
            },
        [normalizedToId],
    );

    const [messages, setMessages] = useState([]);
    const [connectionError, setConnectionError] = useState("");
    const scrollRef = useRef(null);

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
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        if (!database) {
            setConnectionError(
                "Thiếu cấu hình Firebase Realtime Database.",
            );
            return undefined;
        }

        setConnectionError("");
        const chatRef = ref(database, `chats/${roomId}`);

        const unsubscribe = onValue(chatRef, (snapshot) => {
            const payload = snapshot.val();
            const nextMessages = payload
                ? Object.entries(payload).map(([id, value]) => ({
                    id,
                    ...value,
                }))
                : [];

            nextMessages.sort(
                (left, right) => (left.timestamp || 0) - (right.timestamp || 0),
            );

            // Fill missing avatar fields with current/partner avatar fallbacks
            const normalized = nextMessages.map((m) => ({
                ...m,
                senderAvatar: m.senderAvatar || (String(m.senderId) === String(currentUser.id) ? currentUser.avatar : partnerUser.avatar),
            }));

            setMessages(normalized);
        });

        return () => unsubscribe();
    }, [database, roomId, currentUser, partnerUser]);

    const handleSend = (text) => {
        if (!database) {
            return;
        }

        const chatRef = ref(database, `chats/${roomId}`);
        void push(chatRef, {
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            recipientId: partnerUser.id,
            recipientName: partnerUser.name,
            recipientAvatar: partnerUser.avatar,
            text,
            timestamp: Date.now(),
        });
    };

    const headerTitle = `Chat: ${currentUser.name} → ${partnerUser.name}`;

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <h4 className="mb-1">{headerTitle}</h4>
                    <div className="text-secondary small">
                        Phòng Chat Real-time giữa 2 người dùng giả lập.
                    </div>
                </Col>
                <Col className="text-end align-self-center">
                    <div className="d-inline-flex flex-wrap gap-2 justify-content-end">
                        <Badge bg="primary">{currentUser.name}</Badge>
                        <Badge bg="secondary">{partnerUser.name}</Badge>
                    </div>
                </Col>
            </Row>

            {connectionError && (
                <Alert variant="warning" className="mb-3">
                    {connectionError}
                </Alert>
            )}

            <Card
                className="mb-3"
                style={{
                    height: "60vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    ref={scrollRef}
                    style={{ overflowY: "auto", padding: 16, flex: 1 }}
                >
                    {messages.map((m) => (
                        <MessageBubble
                            key={m.id}
                            message={m}
                            isOwn={
                                String(m.senderId) === String(currentUser.id)
                            }
                        />
                    ))}
                </div>
                <Card.Footer>
                    <ChatInput onSend={handleSend} />
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default Chat;
