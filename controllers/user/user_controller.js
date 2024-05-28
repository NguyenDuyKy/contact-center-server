const handleError = require("http-errors");
const user = require("../../models/user/user_model");
const { registerUserSchema, loginUserSchema, recoverPasswordSchema } = require("../../common/helpers/validation_schema");
const jwtHelper = require("../../common/helpers/jwt");
const { ERROR_DESC } = require("../../common/constants");
const client = require("../../common/config/init_redis");
const { generateOTP, generateAutocallSCCO, hashedPassword } = require("../../common/utils/utils");
const stringeeRestAxiosClient = require("../../common/helpers/stringeeRestAxiosClient");

const userController = {
    register: async (req, res, next) => {
        try {
            const validated = await registerUserSchema.validateAsync(req.body);

            //Check email exist
            const emailExist = await user.findOne({ email: validated.email });
            if (emailExist) throw handleError.Conflict(`${validated.email} ${ERROR_DESC.IS_ALREADY_REGISTED}`);
            validated.phone_number = await validated.phone_number.replace(/^0/, "84");
            const registerUser = new user(validated);
            const saveUser = await registerUser.save();
            return res.send({ register: "Success", user: { name: saveUser.name, email: saveUser.email } });
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const validated = await loginUserSchema.validateAsync(req.body);

            //Check email exist
            const loginUser = await user.findOne({ email: validated.email });
            if (!loginUser) throw handleError.NotFound(ERROR_DESC.NOT_REGISTER);

            //Check password valid
            const isValidPassword = await loginUser.isValidPassword(validated.password);
            if (!isValidPassword) throw handleError.Unauthorized(ERROR_DESC.INVALID_PASSWORD);

            const accessToken = await jwtHelper.signAccessToken(loginUser.id);
            const refreshToken = await jwtHelper.signRefreshToken(loginUser.id);
            return res.send({
                login: "Success", user: {
                    name: loginUser.name,
                    email: loginUser.email,
                    stringee_userid: loginUser.stringee_userid,
                    phone_number: loginUser.phone_number
                }, accessToken, refreshToken
            });
        } catch (err) {
            if (err.isJoi === true) return next(handleError.BadRequest(ERROR_DESC.INVALID_EMAIL_PASSWORD));
            next(err);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw handleError.BadRequest();
            const userId = await jwtHelper.verifyRefreshToken(refreshToken);
            if (typeof (userId) !== "string") throw userId;
            const accessToken = await jwtHelper.signAccessToken(userId);
            res.send({ refreshToken: "Success", accessToken: accessToken });
        } catch (err) {
            next(err);
        }
    },
    logout: async (req, res, next) => {
        try {
            var refreshToken;
            if (req.body && req.body.refreshToken) refreshToken = req.body.refreshToken;
            if (!refreshToken) throw handleError.BadRequest();
            const userId = await jwtHelper.verifyRefreshToken(refreshToken);
            if (typeof (userId) !== "string") throw userId;
            await client.del(userId);
            res.send({ logout: "Success" });
        } catch (err) {
            next(err);
        }
    },
    sendOTP: async (req, res, next) => {
        try {
            if (!req.body.email) throw handleError.BadRequest();
            const userRespone = await user.findOne({ email: req.body.email });
            if (!userRespone) throw handleError.NotFound(ERROR_DESC.NOT_REGISTER);
            const checkOTPExist = await client.get(userRespone.phone_number);
            if (checkOTPExist) throw handleError.BadRequest(ERROR_DESC.TO_MANY_REQUESTS);
            const OTP = generateOTP();
            let stringeeSCCO = generateAutocallSCCO(OTP, userRespone.phone_number);
            const sendOTPResponse = await stringeeRestAxiosClient.post("/call2/callout", stringeeSCCO);
            if (sendOTPResponse.r === 0) {
                await client.set(userRespone.phone_number, OTP, {
                    EX: 80
                });
                res.send({ sendOTP: "Success", OTP });
            } else throw handleError.BadRequest();
        } catch (err) {
            next(err);
        }
    },
    recoverPassword: async (req, res, next) => {
        try {
            if (!req.body || JSON.stringify(req.body) === "{}") throw handleError.BadRequest();
            const validated = await recoverPasswordSchema.validateAsync(req.body);
            const userRespone = await user.findOne({ email: validated.email });
            if (!userRespone) throw handleError.NotFound(ERROR_DESC.NOT_REGISTER);
            const OTP = await client.get(userRespone.phone_number);
            if (!OTP) throw handleError.NotFound(ERROR_DESC.OTP_NOT_FOUND);
            if (validated.otp !== OTP) throw handleError.BadRequest(ERROR_DESC.OTP_NOT_MATCH);
            const newPassword = await hashedPassword(validated.newPassword);
            const updateUserResponse = await user.findByIdAndUpdate(userRespone.id, { password: newPassword }, { new: true });
            if (updateUserResponse) {
                await client.del(userRespone.phone_number);
                res.send({ recoverPassword: "Success" });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = userController;

