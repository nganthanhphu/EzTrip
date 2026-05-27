import React from 'react';
import { Button, Form } from 'react-bootstrap';

export function MessageBubble({ message, isOwn }) {
    const alignClass = isOwn ? 'text-end' : 'text-start';
    const bubbleBg = isOwn ? 'bg-primary text-white' : 'bg-light text-dark';
    const wrapperStyle = {
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        padding: '6px 0',
    };

    return (
        <div style={wrapperStyle} className={alignClass}>
            {!isOwn && (
                <div style={{ width: 36, height: 36, borderRadius: 18, background: '#ddd', display: 'inline-block', marginRight: 8, textAlign: 'center', lineHeight: '36px', fontWeight: 600 }}>
                    {message.from ? String(message.from).slice(0,2).toUpperCase() : 'U'}
                </div>
            )}

            <div style={{ maxWidth: '70%' }}>
                <div className={`p-2 rounded ${bubbleBg}`}>
                    <div>{message.text}</div>
                </div>
                <div className="text-muted small mt-1" style={{ fontSize: 11 }}>
                    {new Date(message.createdAt).toLocaleString()}
                </div>
            </div>

            {isOwn && (
                <div style={{ width: 36, height: 36, borderRadius: 18, background: '#0d6efd', display: 'inline-block', marginLeft: 8, textAlign: 'center', lineHeight: '36px', color: '#fff', fontWeight: 600 }}>
                    Me
                </div>
            )}
        </div>
    );
}

export function ChatInput({ placeholder = 'Viết tin nhắn...', onSend }) {
    const [text, setText] = React.useState('');

    const submit = (e) => {
        e?.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText('');
    };

    return (
        <Form onSubmit={submit} className="d-flex gap-2 align-items-center">
            <Form.Control value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
            <Button type="submit" variant="primary">Gửi</Button>
        </Form>
    );
}

export default {
    MessageBubble,
    ChatInput,
};
