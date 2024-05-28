const mongoose = require("mongoose");
const schema = mongoose.Schema;

const contactSchema = new schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    address: {
        type: String
    },
    company: {
        type: String
    },
    vip: {
        type: Boolean,
        default: false
    }
});

const contact = mongoose.model("contact", contactSchema);
module.exports = contact;