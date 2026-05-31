import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Badge, Modal } from "react-bootstrap";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, push, ref } from "firebase/database";
import FirebaseConfigs from "@configs/FirebaseConfigs";
import defaultAvatar from "@assets/images/default_avatar.jpg";
import { MessageBubble, ChatInput } from "@components/common/ChatComponents";
import { useAuth } from "@hooks/useAuth";

function resolveFallbackAvatar(senderId, currentUserId, partnerUserId, currentAvatar, partnerAvatar) {
	if (String(senderId) === String(currentUserId)) {
		return currentAvatar || defaultAvatar;
	}

	if (String(senderId) === String(partnerUserId)) {
		return partnerAvatar || defaultAvatar;
	}

	return defaultAvatar;
}

function ModalChat({
	show = true,
	onHide,
	currentUserId,
	partnerUserId,
	roomId,
	currentName,
	partnerName,
	currentAvatar,
	partnerAvatar,
}) {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const { currentUser } = useAuth();
	const scrollRef = useRef(null);
	const [messages, setMessages] = useState([]);

	const fallbackCurrentUserId = String(currentUserId || currentUser?.id || params.fromId || "").trim();
	const fallbackPartnerUserId = String(partnerUserId || params.toId || "").trim();
	const fallbackRoomId = String(roomId || "").trim();
	const resolvedCurrentName = currentName || currentUser?.name || currentUser?.fullname || "Tôi";
	const resolvedPartnerName = partnerName || location.state?.partnerName || "Đối tác";
	const resolvedCurrentAvatar = currentAvatar || currentUser?.avatar || defaultAvatar;
	const resolvedPartnerAvatar = partnerAvatar || location.state?.partnerAvatar || defaultAvatar;

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

	const currentId = fallbackCurrentUserId;
	const partnerId = fallbackPartnerUserId;
	const resolvedRoomId = fallbackRoomId || (currentId && partnerId ? [currentId, partnerId].sort().join("__") : "");

	useEffect(() => {
		if (!database || !resolvedRoomId || !currentId || !partnerId) return undefined;

		const chatRef = ref(database, `chats/${resolvedRoomId}`);
		const unsubscribe = onValue(chatRef, (snapshot) => {
			const payload = snapshot.val();
			const nextMessages = payload
				? Object.entries(payload).map(([id, value]) => ({ id, ...value }))
				: [];

			nextMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

			const normalized = nextMessages.map((message) => ({
				...message,
				senderAvatar: message.senderAvatar || resolveFallbackAvatar(message.senderId, currentId, partnerId, resolvedCurrentAvatar, resolvedPartnerAvatar),
				recipientAvatar: message.recipientAvatar || resolveFallbackAvatar(message.recipientId, currentId, partnerId, resolvedCurrentAvatar, resolvedPartnerAvatar),
				senderName: message.senderName || (String(message.senderId) === String(currentId) ? resolvedCurrentName : resolvedPartnerName),
				recipientName: message.recipientName || (String(message.recipientId) === String(currentId) ? resolvedCurrentName : resolvedPartnerName),
			}));

			setMessages(normalized);
		});

		return () => unsubscribe();
	}, [database, resolvedRoomId, currentId, partnerId, resolvedCurrentAvatar, resolvedCurrentName, resolvedPartnerAvatar, resolvedPartnerName]);

	const missingIds = !currentId || !partnerId;

	const handleSend = (text) => {
		if (missingIds || !database || !resolvedRoomId) return;

		const chatRef = ref(database, `chats/${resolvedRoomId}`);
		void push(chatRef, {
			senderId: currentId,
			senderName: resolvedCurrentName,
			recipientId: partnerId,
			recipientName: resolvedPartnerName,
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

	const headerTitle = `Chat: ${resolvedCurrentName} → ${resolvedPartnerName}`;

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
						<Badge bg="primary">{resolvedCurrentName}</Badge>
						<Badge bg="secondary">{resolvedPartnerName}</Badge>
					</div>
					<div className="text-muted small">
						{missingIds ? "Thiếu ID người dùng" : `Room: ${resolvedRoomId ? `${resolvedRoomId.slice(0, 12)}...` : "-"}`}
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
