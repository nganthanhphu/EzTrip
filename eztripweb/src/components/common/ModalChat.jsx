import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Badge, Modal, Spinner } from "react-bootstrap";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, push, ref } from "firebase/database";
import FirebaseConfigs from "../../configs/FirebaseConfigs";
import defaultAvatar from "@assets/images/default_avatar.jpg";
import { MessageBubble, ChatInput } from "@components/common/ChatComponents";
import { useAuth } from "@hooks/useAuth";

async function sha256Hex(input) {
	const encoded = new TextEncoder().encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
	return Array.from(new Uint8Array(hashBuffer))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

function buildSeed(value) {
	return `${FirebaseConfigs.tokenHashSalt}${String(value || "").trim()}`;
}

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
	currentPhoneNumber,
	partnerPhoneNumber,
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
	const [connectionError, setConnectionError] = useState("");
	const [loadingRoom, setLoadingRoom] = useState(true);
	const [chatMeta, setChatMeta] = useState({
		currentUserId: "",
		partnerUserId: "",
		roomId: "",
	});

	const fallbackCurrentPhone = currentUser?.phoneNumber || currentPhoneNumber || params.fromId || "";
	const fallbackPartnerPhone = partnerPhoneNumber || params.toId || "";
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

	useEffect(() => {
		let cancelled = false;

		async function prepareRoom() {
			setLoadingRoom(true);
			setConnectionError("");

			if (!show) {
				setLoadingRoom(false);
				return;
			}

			if (!FirebaseConfigs.tokenHashSalt) {
				setConnectionError("Thiếu token hash salt cho phòng chat.");
				setLoadingRoom(false);
				return;
			}

			if (!fallbackCurrentPhone || !fallbackPartnerPhone) {
				setConnectionError("Thiếu số điện thoại để tạo phòng chat.");
				setLoadingRoom(false);
				return;
			}

			try {
				const [currentUserId, partnerUserId] = await Promise.all([
					sha256Hex(buildSeed(fallbackCurrentPhone)),
					sha256Hex(buildSeed(fallbackPartnerPhone)),
				]);

				const roomId = await sha256Hex([currentUserId, partnerUserId].sort().join("__"));

				if (!cancelled) {
					setChatMeta({
						currentUserId,
						partnerUserId,
						roomId,
					});
				}
			} catch {
				if (!cancelled) {
					setConnectionError("Không thể khởi tạo phòng chat đã băm.");
				}
			} finally {
				if (!cancelled) {
					setLoadingRoom(false);
				}
			}
		}

		prepareRoom();

		return () => {
			cancelled = true;
		};
	}, [fallbackCurrentPhone, fallbackPartnerPhone, show]);

	useEffect(() => {
		if (!database || !chatMeta.roomId || !chatMeta.currentUserId || !chatMeta.partnerUserId) {
			return undefined;
		}

		const chatRef = ref(database, `chats/${chatMeta.roomId}`);
		const unsubscribe = onValue(chatRef, (snapshot) => {
			const payload = snapshot.val();
			const nextMessages = payload
				? Object.entries(payload).map(([id, value]) => ({
					id,
					...value,
				}))
				: [];

			nextMessages.sort((left, right) => (left.timestamp || 0) - (right.timestamp || 0));

			const normalized = nextMessages.map((message) => ({
				...message,
				senderAvatar: message.senderAvatar || resolveFallbackAvatar(message.senderId, chatMeta.currentUserId, chatMeta.partnerUserId, resolvedCurrentAvatar, resolvedPartnerAvatar),
				recipientAvatar: message.recipientAvatar || resolveFallbackAvatar(message.recipientId, chatMeta.currentUserId, chatMeta.partnerUserId, resolvedCurrentAvatar, resolvedPartnerAvatar),
				senderName: message.senderName || (String(message.senderId) === String(chatMeta.currentUserId) ? resolvedCurrentName : resolvedPartnerName),
				recipientName: message.recipientName || (String(message.recipientId) === String(chatMeta.currentUserId) ? resolvedCurrentName : resolvedPartnerName),
			}));

			setMessages(normalized);
		});

		return () => unsubscribe();
	}, [database, chatMeta, resolvedCurrentAvatar, resolvedCurrentName, resolvedPartnerAvatar, resolvedPartnerName]);

	const handleSend = (text) => {
		if (!database || !chatMeta.roomId || !chatMeta.currentUserId || !chatMeta.partnerUserId) {
			return;
		}

		const chatRef = ref(database, `chats/${chatMeta.roomId}`);
		void push(chatRef, {
			senderId: chatMeta.currentUserId,
			senderName: resolvedCurrentName,
			recipientId: chatMeta.partnerUserId,
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
					<div className="text-muted small">Phòng chat sử dụng định danh đã băm từ số điện thoại.</div>
				</div>
			</Modal.Header>
			<Modal.Body className="p-0 d-flex flex-column" style={{ minHeight: "70vh" }}>
				<div className="d-flex flex-wrap gap-2 justify-content-between align-items-center border-bottom px-3 py-2 bg-light">
					<div className="d-inline-flex flex-wrap gap-2">
						<Badge bg="primary">{resolvedCurrentName}</Badge>
						<Badge bg="secondary">{resolvedPartnerName}</Badge>
					</div>
					<div className="text-muted small">
						{loadingRoom ? "Đang khởi tạo phòng..." : `Room: ${chatMeta.roomId ? `${chatMeta.roomId.slice(0, 12)}...` : "-"}`}
					</div>
				</div>

				{connectionError ? (
					<Alert variant="warning" className="m-3 mb-0">
						{connectionError}
					</Alert>
				) : null}

				<div ref={scrollRef} className="flex-grow-1 overflow-auto p-3 bg-white">
					{loadingRoom ? (
						<div className="d-flex justify-content-center align-items-center h-100 py-5">
							<Spinner animation="border" role="status" />
						</div>
					) : messages.length > 0 ? (
						messages.map((message) => (
							<MessageBubble
								key={message.id}
								message={message}
								isOwn={String(message.senderId) === String(chatMeta.currentUserId)}
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
