const jwt = require("jsonwebtoken");
const handleError = require("http-errors");
const sidKey = process.env.SID_KEY;
const secrectKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const client = require("../config/init_redis");

const jwtHelper = {
    signAccessToken: async (userId) => {
        try {
            const now = Math.floor(Date.now() / 1000);
            const header = { cty: "duyky-api" };
            const payload = {
                jti: sidKey + "-" + now,
                userId: userId
            };
            const options = {
                header: header,
                algorithm: "HS256",
                noTimestamp: true,
                expiresIn: "24h",
                issuer: sidKey
            };
            const token = jwt.sign(payload, secrectKey, options);
            return token;
        } catch (err) {
            console.log(err.message);
            return handleError.InternalServerError();
        }
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers["ndk-auth"]) return next(handleError.Unauthorized());
        const token = req.headers["ndk-auth"];
        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) {
                const errorMessage = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return next(handleError.Unauthorized(errorMessage));
            }
            req.payload = payload;
            next();
        });
    },
    signRefreshToken: async (userId) => {
        try {
            const now = Math.floor(Date.now() / 1000);
            const header = { cty: "duyky-api" };
            const payload = {
                jti: sidKey + "-" + now,
                userId: userId
            };
            const options = {
                header: header,
                algorithm: "HS256",
                noTimestamp: true,
                expiresIn: "365d",
                issuer: sidKey
            };
            const token = jwt.sign(payload, refreshSecretKey, options);
            await client.set(userId, token, {
                EX: 365 * 24 * 60 * 60
            });
            return token;
        } catch (err) {
            console.log(err.message);
            return handleError.InternalServerError();
        }
    },
    verifyRefreshToken: async (token) => {
        try {
            const payload = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
            const userId = payload.userId;
            const refToken = await client.get(userId);
            if (token === refToken) return userId;
            else throw handleError.Unauthorized();
        } catch (err) {
            console.log(err.message);
            return handleError.Unauthorized();
        }
    },
};

module.exports = jwtHelper;