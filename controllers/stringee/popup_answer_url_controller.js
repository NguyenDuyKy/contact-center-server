const handleError = require("http-errors");
const contactModel = require("../../models/contact/contact_model");
const { ERROR_DESC } = require("../../common/constants");

const popupAnswerUrlController = async (req, res, next) => {
    try {
        const queryParams = req.query;
        const queryConditions = {};
        var args = {};
        for (const key in queryParams) {
            if (Object.hasOwnProperty.call(queryParams, key)) {
                queryConditions[key] = queryParams[key];
            }
        }
        if (queryConditions.callDirection && queryConditions.callDirection === "outbound") {
            args = { phone_number: queryConditions.calleeNumber.replace(/^0/, "84") };
        } else if (queryConditions.callDirection && queryConditions.callDirection === "inbound") {
            args = { phone_number: queryConditions.callerNumber.replace(/^0/, "84") };
        } else {
            args = { phone_number: queryConditions.call_type === "1" ? queryConditions.to_number : queryConditions.from_number };
        }
        var contactList = await contactModel.find(args);
        if (contactList.length === 0) contactList = "Contact not found in DB";
        return res.send({ stringeeQuery: queryConditions, customerData: contactList });
    } catch (err) {
        next(err);
    }
}

module.exports = popupAnswerUrlController;