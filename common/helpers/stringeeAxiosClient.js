const axios = require("axios");
const generateStringeeToken = require("./stringee_token");

const axiosClient = axios.create({
    baseURL: process.env.STRINGEE_PCC_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use(
    async config => {
        const restToken = generateStringeeToken.restToken();
        config.headers["X-STRINGEE-AUTH"] = restToken;
        return config;
    },
    async error => {
        throw error;
    }
);

axiosClient.interceptors.response.use(
    async response => {
        return response.data;
    },
    async error => {
        if (error.response && error.response.data)
            throw error.response.data;
        else {
            throw error;
        }
    }
);

module.exports = axiosClient;