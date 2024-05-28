const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.DB_NAME
        });
        console.log(`Connect to mongoDB database ${mongoose.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;