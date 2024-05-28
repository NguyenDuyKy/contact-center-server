const handleError = require("http-errors");
const contactModel = require("../../models/contact/contact_model");
const { createContactSchema, updateContactSchema } = require("../../common/helpers/validation_schema");
const { ERROR_DESC } = require("../../common/constants");

const contactController = {
    createContact: async (req, res, next) => {
        try {
            const validated = await createContactSchema.validateAsync(req.body);
            validated.phone_number = await validated.phone_number.replace(/^0/, "84");

            const phoneNumberExist = await contactModel.findOne({ phone_number: validated.phone_number });
            if (phoneNumberExist) throw handleError.Conflict(`${validated.phone_number} ${ERROR_DESC.CONTACT_EXIST}`);

            const emailExist = await contactModel.findOne({ email: validated.email });
            if (emailExist) throw handleError.Conflict(`${validated.email} ${ERROR_DESC.CONTACT_EXIST}`);

            const newContact = new contactModel(validated);
            const saveNewContact = await newContact.save();
            return res.send({ createNewContact: "Success", newContact: saveNewContact });
        } catch (err) {
            next(err);
        }
    },
    updateContact: async (req, res, next) => {
        try {
            if (Object.keys(req.body).length === 0) throw handleError.BadRequest(ERROR_DESC.REQUEST_BODY_EMPTY);
            const contactId = req.url.replace(/^\//, "");

            const validated = await updateContactSchema.validateAsync(req.body);

            if (req.body.phone_number) {
                validated.phone_number = await validated.phone_number.replace(/^0/, "84");
                const phoneNumberExist = await contactModel.findOne({ phone_number: validated.phone_number });
                if (phoneNumberExist && phoneNumberExist.id !== contactId) {
                    throw handleError.Conflict(`${validated.phone_number} ${ERROR_DESC.CONTACT_EXIST}`);
                }
            }

            if (req.body.email) {
                const emailExist = await contactModel.findOne({ email: validated.email });
                if (emailExist && emailExist.id !== contactId) {
                    throw handleError.Conflict(`${validated.email} ${ERROR_DESC.CONTACT_EXIST}`);
                }
            }

            const updatedContact = await contactModel.findByIdAndUpdate(contactId, validated, { new: true });
            if (!updatedContact) throw handleError.NotFound(ERROR_DESC.CONTACT_NOT_FOUND);
            return res.send({ updateContact: "Success", updatedContact: updatedContact });
        } catch (err) {
            next(err);
        }
    },
    deleteContact: async (req, res, next) => {
        try {
            const contactId = req.url.replace(/^\/delete\//, "");
            const deleteResult = await contactModel.findByIdAndDelete(contactId);
            if (!deleteResult) throw handleError.NotFound(ERROR_DESC.CONTACT_NOT_FOUND);
            return res.send({ deleteContact: "Success", deletedData: deleteResult });
        } catch (err) {
            next(err);
        }
    },
    deleteMultiContact: async (req, res, next) => {
        try {
            const queryParams = req.query;
            const queryConditions = {};
            for (const key in queryParams) {
                if (Object.hasOwnProperty.call(queryParams, key)) {
                    queryConditions[key] = queryParams[key];
                }
            }
            const deleteResult = await contactModel.deleteMany(queryConditions);
            if (!deleteResult) throw handleError.NotFound(ERROR_DESC.CONTACT_NOT_FOUND);
            return res.send({ deleteMultiContact: "Success", deletedData: deleteResult });
        } catch (err) {
            next(err);
        }
    },
    getContact: async (req, res, next) => {
        try {
            const contactId = req.url.replace(/^\//, "");
            const contact = await contactModel.findById(contactId);
            if (!contact) throw handleError.NotFound(ERROR_DESC.CONTACT_NOT_FOUND);
            return res.send({ getContact: "Success", contact: contact });
        } catch (err) {
            next(err);
        }
    },
    getContactList: async (req, res, next) => {
        try {
            const queryParams = req.query;
            const queryConditions = {};
            for (const key in queryParams) {
                if (Object.hasOwnProperty.call(queryParams, key)) {
                    queryConditions[key] = queryParams[key];
                }
            }
            const contactList = await contactModel.find(queryConditions);
            return res.send({ getListContact: "Success", contactList: contactList });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = contactController;