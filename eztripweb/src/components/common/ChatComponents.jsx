import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { formatTimestamp } from '@utils/formatters';

export function MessageBubble({ message, isOwn }) {
    const alignClass = isOwn ? 'text-end' : 'text-start';
    const bubbleBg = isOwn ? 'bg-primary text-white' : 'bg-light text-dark';
    const wrapperStyle = {
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        padding: '6px 0',
    };

    const avatarUrl = message.senderAvatar || message.avatar || message.senderPhoto || message.photo;

    const AvatarImage = ({ url, alt, style }) => (
        <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', display: 'inline-block', ...style }}>
            <img src={url} alt={alt} style={{ width: '36px', height: '36px', objectFit: 'cover', display: 'block' }} />
        </div>
    );

    const InitialsBubble = ({ name, fallback='U', style }) => (
        <div style={{ width: 36, height: 36, borderRadius: 18, background: '#ddd', display: 'inline-block', marginRight: 8, textAlign: 'center', lineHeight: '36px', fontWeight: 600, ...style }}>
            {name ? String(name).slice(0, 2).toUpperCase() : fallback}
        </div>
    );

    return (
        <div style={wrapperStyle} className={alignClass}>
            {!isOwn && (
                avatarUrl ? (
                    <AvatarImage url={avatarUrl} alt={message.senderName || 'avatar'} style={{ marginRight: 8 }} />
                ) : (
                    <InitialsBubble name={message.senderName || message.from} style={{ marginRight: 8 }} />
                )
            )}

            <div style={{ maxWidth: '70%' }}>
                <div className={`p-2 rounded ${bubbleBg}`}>
                    <div className="fw-semibold small mb-1">{message.senderName || (isOwn ? 'Me' : 'User')}</div>
                    <div>{message.text}</div>
                </div>
                <div className="text-muted small mt-1" style={{ fontSize: 11 }}>
                    {formatTimestamp(message.timestamp || message.createdAt || Date.now())}
                </div>
            </div>

            {isOwn && (
                avatarUrl ? (
                    <AvatarImage url={avatarUrl} alt={message.senderName || 'me'} style={{ marginLeft: 8 }} />
                ) : (
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: '#0d6efd', display: 'inline-block', marginLeft: 8, textAlign: 'center', lineHeight: '36px', color: '#fff', fontWeight: 600 }}>
                        {message.senderName ? String(message.senderName).slice(0, 2).toUpperCase() : 'ME'}
                    </div>
                )
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

const ChatComponents = {
    MessageBubble,
    ChatInput,
};

export default ChatComponents;
