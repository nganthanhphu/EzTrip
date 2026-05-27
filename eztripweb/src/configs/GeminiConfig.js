// Gemini (AI / external) service configuration.
// Use environment variables to avoid committing secrets.
// Example: REACT_APP_GEMINI_API_KEY=your_key

export const GeminiConfig = {
	apiKey: process.env.REACT_APP_GEMINI_API_KEY || "",
	baseUrl: process.env.REACT_APP_GEMINI_BASE_URL || "https://api.gemini.com",
	model: process.env.REACT_APP_GEMINI_MODEL || "gpt-4o-mini",
};

export default GeminiConfig;
