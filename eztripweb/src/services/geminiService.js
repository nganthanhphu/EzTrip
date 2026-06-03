import GeminiConfig from "@configs/GeminiConfig";

const generateDescription = async (form, providerType) => {
    const { apiKey, baseUrl, model } = GeminiConfig;
    
    if (!apiKey) {
        throw new Error("Lỗi hệ thống: Chưa cấu hình Gemini API Key.");
    }

    let prompt = `Bạn là một chuyên gia Copywriter mảng du lịch. Hãy viết một đoạn mô tả (khoảng 100-150 từ) thật hấp dẫn và chuẩn SEO cho dịch vụ sau:\n`;
    
    prompt += `- Tên dịch vụ: ${form.name || "Chưa có tên"}\n`;
    if (form.price) prompt += `- Mức giá: ${form.price} VND\n`;

    if (providerType === 1) {
        prompt += `- Loại dịch vụ: Tour du lịch\n`;
        if (form.location) prompt += `- Địa điểm: ${form.location}\n`;
        if (form.tourDuration) prompt += `- Thời lượng: ${form.tourDuration} ngày\n`;
    } else if (providerType === 2) {
        prompt += `- Loại dịch vụ: Lưu trú\n`;
        if (form.location) prompt += `- Vị trí: ${form.location}\n`;
        if (form.area) prompt += `- Diện tích: ${form.area} m²\n`;
        if (form.quantityOfBed) prompt += `- Số giường: ${form.quantityOfBed}\n`;
    } else if (providerType === 3) {
        prompt += `- Loại dịch vụ: Vận chuyển\n`;
        if (form.departureLocation && form.arrivalLocation) {
            prompt += `- Tuyến đường: Từ ${form.departureLocation} đến ${form.arrivalLocation}\n`;
        }
    }

    prompt += `\nYêu cầu đầu ra: Viết thành đoạn văn hoàn chỉnh, chuyên nghiệp. Không dùng các câu chào hỏi hay dư thừa (chỉ trả về phần nội dung mô tả). Chỉ trả về plain text, không kèm định dạng hay ký tự đặc biệt.`;

    const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error?.message || "Đã xảy ra lỗi khi kết nối với AI.");
    }

    return data.candidates[0].content.parts[0].text;
};

const summarizeReviews = async (reviews) => {
    const { apiKey, baseUrl, model } = GeminiConfig;
    if (!apiKey) throw new Error("Chưa cấu hình API Key.");

    const validReviews = reviews.filter(r => r.comment && r.comment.trim() !== "");
    
    if (validReviews.length === 0) {
        return "Không có nội dung đánh giá bằng chữ để tóm tắt.";
    }

    const reviewsText = validReviews.map(
        (r, index) => `${index + 1}. Điểm: ${r.rating}/10 - Nhận xét: "${r.comment}"`
    ).join("\n");

    const prompt = `Bạn là chuyên gia phân tích trải nghiệm khách hàng. Hãy đọc danh sách đánh giá sau và viết một đoạn tóm tắt ngắn gọn (khoảng 3-5 câu), nêu bật ưu điểm và nhược điểm chung của dịch vụ. Văn phong khách quan, chuyên nghiệp.
    
Danh sách đánh giá:
${reviewsText}

Kết quả tóm tắt:`;

    const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Lỗi kết nối AI.");

    return data.candidates[0].content.parts[0].text;
};

export default { generateDescription, summarizeReviews };