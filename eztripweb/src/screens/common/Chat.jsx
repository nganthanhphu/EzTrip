import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { MessageBubble, ChatInput } from '@components/common/ChatComponents';

function Chat() {
    const { fromId, toId } = useParams();
    const [messages, setMessages] = useState(() => [
        { id: 1, from: toId, to: fromId, text: 'Chào bạn, mình có thể giúp gì?', createdAt: Date.now() - 1000 * 60 * 60 },
        { id: 2, from: fromId, to: toId, text: 'Xin chào, mình muốn hỏi về dịch vụ.', createdAt: Date.now() - 1000 * 60 * 50 },
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = (text) => {
        const next = { id: Date.now(), from: fromId, to: toId, text, createdAt: Date.now() };
        setMessages((m) => [...m, next]);
    };

    const headerTitle = `Chat: ${fromId} → ${toId}`;

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <h4 className="mb-1">{headerTitle}</h4>
                    <div className="text-secondary small">Giao diện chat đơn giản, dùng chung cho cả khách và nhà cung cấp. Xác định người gửi/nhận qua route params.</div>
                </Col>
                <Col className="text-end align-self-center">
                    <Badge bg="secondary">{toId}</Badge>
                </Col>
            </Row>

            <Card className="mb-3" style={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
                <div ref={scrollRef} style={{ overflowY: 'auto', padding: 16, flex: 1 }}>
                    {messages.map((m) => (
                        <MessageBubble key={m.id} message={m} isOwn={String(m.from) === String(fromId)} />
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
