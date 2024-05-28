const handleError = require("http-errors");
const generateStringeeToken = require("../../common/helpers/stringee_token");
const stringeeAxiosClient = require("../../common/helpers/stringeeAxiosClient");
const { ERROR_DESC } = require("../../common/constants");

const numberController = {
    getList: async (req, res, next) => {
        try {
            const getNumberListResponse = await stringeeAxiosClient.get("/number");
            return res.send(getNumberListResponse);
        } catch (err) {
            next(err);
        }
    }
};


module.exports = numberController;
