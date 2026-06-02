import { Card, Carousel, Image } from "react-bootstrap";
import defaultAccommodationImage from "@assets/images/default_accommodation_item.jpg";

function PanelAlbum({ images = []}) {
	const sourceImages = images;
	const imagesList = Array.isArray(sourceImages) && sourceImages.length > 0
		? sourceImages.map((item) => (typeof item === "string" ? item : item?.url)).filter(Boolean)
		: [defaultAccommodationImage];

	return (
		<Card className="h-100 shadow-sm">
			<Card.Header className="bg-white fw-semibold">
				Album ảnh
			</Card.Header>
			<Card.Body className="p-0">
				<Carousel interval={null} indicators={imagesList.length > 1} controls={imagesList.length > 1}>
					{imagesList.map((url, index) => (
						<Carousel.Item key={`${url}-${index}`}>
							<div className="ratio ratio-4x3 bg-body-secondary">
								<Image
									src={url}
									alt={`Ảnh ${index + 1}`}
									className="w-100 h-100 object-fit-cover"
								/>
							</div>
						</Carousel.Item>
					))}
				</Carousel>
			</Card.Body>
		</Card>
	);
}

export default PanelAlbum;
