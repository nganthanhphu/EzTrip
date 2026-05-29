import { useContext, useState } from "react";
import { Button, Card, Image, ListGroup } from "react-bootstrap";
import AuthContext from "@contexts/AuthContext";
import ModalChat from "@components/common/ModalChat";

function PanelProviderInfo(props = {}) {
	const { companyId, companyName, companyAvatar, companyAddress, companyPhone, companyEmail } = props;
	const { currentUser } = useContext(AuthContext);
	const [showChatModal, setShowChatModal] = useState(false);

	return (
		<Card className="h-100 shadow-sm">
			<Card.Header className="bg-white fw-semibold">
				Thông tin nhà cung cấp
			</Card.Header>
			<Card.Body>
				<div className="d-flex justify-content-center mb-3">
					<Image
						src={companyAvatar}
						alt={companyName}
						roundedCircle
						width={128}
						height={128}
						className="border"
					/>
				</div>

				<Card.Title className="text-center mb-3">{companyName}</Card.Title>

				<ListGroup variant="flush" className="mb-3">
					<ListGroup.Item className="px-0">
						<span className="fw-semibold">Địa chỉ:</span> {companyAddress}
					</ListGroup.Item>
					<ListGroup.Item className="px-0">
						<span className="fw-semibold">SĐT:</span> {companyPhone}
					</ListGroup.Item>
					<ListGroup.Item className="px-0">
						<span className="fw-semibold">Email:</span> {companyEmail}
					</ListGroup.Item>
				</ListGroup>

				<div className="d-grid">
					<Button
						variant="primary"
						disabled={!currentUser?.id || !companyId}
						onClick={() => setShowChatModal(true)}
					>
						Chat ngay
					</Button>
				</div>
			</Card.Body>
			<ModalChat
				show={showChatModal}
				onHide={() => setShowChatModal(false)}
				currentUserId={currentUser?.id || ""}
				partnerUserId={companyId || ""}
				currentName={currentUser?.name || currentUser?.fullname || "Tôi"}
				partnerName={companyName}
				currentAvatar={currentUser?.avatar || ""}
				partnerAvatar={companyAvatar}
			/>
		</Card>
	);
}

export default PanelProviderInfo;
