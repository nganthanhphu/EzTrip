import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Badge, Modal } from "react-bootstrap";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, push, ref } from "firebase/database";
import FirebaseConfigs from "@configs/FirebaseConfigs";
import defaultAvatar from "@assets/images/default_avatar.jpg";
import { MessageBubble, ChatInput } from "@components/common/ChatComponents";
import { useAuth } from "@hooks/useAuth";

function ModalChat({show = true, onHide, currentUserId,	partnerUserId, currentName, partnerName, currentAvatar,	partnerAvatar}) {
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const scrollRef = useRef(null);
	const [messages, setMessages] = useState([]);

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
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const currentId = currentUserId || currentUser?.id;
	const partnerId = partnerUserId;
	const roomId = (currentId && partnerId ? [currentId, partnerId].sort().join("__") : "");

	useEffect(() => {
		if (!database || !roomId || !currentId || !partnerId) return undefined;

		const chatRef = ref(database, `chats/${roomId}`);
		const unsubscribe = onValue(chatRef, (snapshot) => {
			const payload = snapshot.val();
			const nextMessages = payload
				? Object.entries(payload).map(([id, value]) => ({ id, ...value }))
				: [];

			nextMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

			const normalized = nextMessages.map((message) => ({
				...message,
				senderAvatar: message.senderAvatar || defaultAvatar,
				recipientAvatar: message.recipientAvatar || defaultAvatar,
				senderName: message.senderName || (String(message.senderId) === String(currentId) ? currentName : partnerName),
				recipientName: message.recipientName || (String(message.recipientId) === String(currentId) ? currentName : partnerName),
			}));

			setMessages(normalized);
		});

		return () => unsubscribe();
	}, [database, roomId, currentId, partnerId, currentAvatar, currentName, partnerAvatar, partnerName]);

	const missingIds = !currentId || !partnerId;

	const handleSend = (text) => {
		if (missingIds || !database || !roomId) return;

		const chatRef = ref(database, `chats/${roomId}`);
		void push(chatRef, {
			senderId: currentId,
			senderName: currentName,
			recipientId: partnerId,
			recipientName: partnerName,
			text,
			timestamp: Date.now(),
		});
	};

	const handleHide = () => {
		if (typeof onHide === "function") {
			onHide();
			return;
		}

		if (window.history.length > 1) {
			navigate(-1);
			return;
		}

		navigate("/", { replace: true });
	};

	const headerTitle = `Chat: ${currentName} → ${partnerName}`;

	return (
		<Modal show={show} onHide={handleHide} centered size="lg" backdrop="static" scrollable>
			<Modal.Header closeButton>
				<div>
					<Modal.Title className="mb-1">{headerTitle}</Modal.Title>
					<div className="text-muted small">Phòng chat theo ID người dùng.</div>
				</div>
			</Modal.Header>
			<Modal.Body className="p-0 d-flex flex-column" style={{ minHeight: "70vh" }}>
				<div className="d-flex flex-wrap gap-2 justify-content-between align-items-center border-bottom px-3 py-2 bg-light">
					<div className="d-inline-flex flex-wrap gap-2">
						<Badge bg="primary">{currentName}</Badge>
						<Badge bg="secondary">{partnerName}</Badge>
					</div>
					<div className="text-muted small">
						{missingIds ? "Thiếu ID người dùng" : `Room: ${roomId ? `${roomId.slice(0, 12)}...` : "-"}`}
					</div>
				</div>

				{missingIds ? (
					<Alert variant="warning" className="m-3 mb-0">Thiếu ID người dùng để kết nối phòng chat.</Alert>
				) : null}

				<div ref={scrollRef} className="flex-grow-1 overflow-auto p-3 bg-white">
					{missingIds ? (
						<div className="text-center text-muted py-5">Thiếu ID người dùng để mở phòng chat.</div>
					) : messages.length > 0 ? (
						messages.map((message) => (
							<MessageBubble
								key={message.id}
								message={message}
								isOwn={String(message.senderId) === String(currentId)}
							/>
						))
					) : (
						<div className="text-center text-muted py-5">Chưa có tin nhắn nào.</div>
					)}
				</div>

				<div className="border-top p-3 bg-light">
					<ChatInput onSend={handleSend} />
				</div>
			</Modal.Body>
		</Modal>
	);
}

export default ModalChat;
