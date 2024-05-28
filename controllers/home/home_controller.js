const user = require("../../models/user/user_model");
const handleError = require("http-errors");

module.exports = {
    home: async (req, res, next) => {
        try {
            const userId = req.payload.userId
            const loginUser = await user.findById(userId);
            if (!loginUser || !loginUser.name) throw handleError.InternalServerError();
            res.send(`Welcome ${loginUser.name} to NDK's server`);
        } catch (err) {
            next(err);
        }
    }
}