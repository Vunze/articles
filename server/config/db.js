const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: true,
        });
        console.log(`MongoDB connection successful : ${conn.connection.host}`);
    } catch (err) {
        console.log(`MongoDB connection error ${err.message}`);
        process.exit();
    }
};

module.exports = connectDB;