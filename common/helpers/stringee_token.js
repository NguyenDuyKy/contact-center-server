const jwt = require("jsonwebtoken");
const stringeeSidKey = process.env.STRINGEE_SID_KEY;
const stringeeSecretKey = process.env.STRINGEE_SECRET_KEY;
const header = {
    typ: "JWT",
    cty: "stringee-api;v=1",
    alg: "HS256",
};

const generateStringeeToken = {
    restToken: () => {
        payload = { ...createPayload(3600), rest_api: true };
        const token = jwt.sign(payload, stringeeSecretKey, { algorithm: "HS256", header: header, noTimestamp: true });
        return token;
    },
    pccClientToken: (userId) => {
        payload = {
            ...createPayload(3600),
            icc_api: true,
            userId: userId,
            subscribe: "agent_manual_status",
            attributes: [
                {
                    attribute: "manual_status",
                    topic: "agent_manual_status"

                }
            ]
        };
        const token = jwt.sign(payload, stringeeSecretKey, { algorithm: "HS256", header: header, noTimestamp: true });
        return token;
    }
};

function createPayload(expiredTimeSeconds) {
    const now = Math.floor(Date.now() / 1000);
    let payload = {
        jti: stringeeSidKey + "-" + now,
        iss: stringeeSidKey,
        exp: now + expiredTimeSeconds,
    }
    return payload;
}

module.exports = generateStringeeToken;