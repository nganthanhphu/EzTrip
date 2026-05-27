export const MomoConfigs = {
	partnerCode: process.env.REACT_APP_MOMO_PARTNER_CODE || "",
	accessKey: process.env.REACT_APP_MOMO_ACCESS_KEY || "",
	secretKey: process.env.REACT_APP_MOMO_SECRET_KEY || "",
	requestUrl: process.env.REACT_APP_MOMO_REQUEST_URL || "https://test-payment.momo.vn/v2/gateway/api/create",
	returnUrl: process.env.REACT_APP_MOMO_RETURN_URL || (process.env.REACT_APP_CLIENT_URL || "http://localhost:3000") + "/payment-return",
	notifyUrl: process.env.REACT_APP_MOMO_NOTIFY_URL || (process.env.REACT_APP_SERVER_URL || "http://localhost:8080") + "/api/momo/notify",
	environment: process.env.REACT_APP_MOMO_ENV || "test",
};

export default MomoConfigs;
