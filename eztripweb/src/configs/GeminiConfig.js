export const GeminiConfig = {
    apiKey: process.env.REACT_APP_GEMINI_API_KEY || "",
    baseUrl: process.env.REACT_APP_GEMINI_BASE_URL || "",
    model: process.env.REACT_APP_GEMINI_MODEL || "",
};

export default GeminiConfig;