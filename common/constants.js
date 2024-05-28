const ERROR_DESC = {
    NOT_REGISTER: "User is not registed",
    INVALID_PASSWORD: "Password is invalid",
    INVALID_EMAIL_PASSWORD: "Invalid Email/Password",
    IS_ALREADY_REGISTED: "is already been registed",
    CONTACT_EXIST: "is already exist",
    CONTACT_NOT_FOUND: "Contact not found",
    REQUEST_BODY_EMPTY: "Request body must not empty",
    AGENT_NOT_FOUND: "Agent not found",
    OTP_NOT_FOUND: "OTP is expired or invalid",
    OTP_NOT_MATCH: "OTP is not match",
    TO_MANY_REQUESTS: "Too many requests, please wait"
}

const VOICE_OTP_MP3 = {
    WELCOME: "asia-1_1_GTR54K32H0BXQAX.mp3",
    EXPIRED: "asia-1_1_7YX8UFG4VV8B2S1.mp3",
    THANKS: "asia-1_1_3L79NTHM1RL0KLK.mp3",
    NUMBER: [
        "asia-1_1_UFGQ21P7VKULSQM.mp3", //0
        "asia-1_1_6MZJAYWNI68ES5R.mp3", //1
        "asia-1_1_XX1HMTCEXJDD0YK.mp3", //2
        "asia-1_1_13461PP3RGG2HS6.mp3", //3
        "asia-1_1_CW17KFG50XCZYG0.mp3", //4
        "asia-1_1_UZFACMG4BNK8URD.mp3", //5
        "asia-1_1_ZMJH5JH406FGF1S.mp3", //6
        "asia-1_1_1ZROGJMKOZ5GIJ1.mp3", //7
        "asia-1_1_77ER1M0C2SOIV2R.mp3", //8
        "asia-1_1_D3JDVTPVOEB534M.mp3", //9
    ]
}

module.exports = {
    ERROR_DESC,
    VOICE_OTP_MP3
};