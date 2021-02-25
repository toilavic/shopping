require('dotenv').config();
const mongoose = require('mongoose');
let url = process.env.MONGODB_URI || 'mongodb+srv://user-vic:user-vic@cluster0.izn5g.mongodb.net/shop?retryWrites=true&w=majority';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,  {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected")
    } catch (error) {
        console.error("MongoDB connection fail");
        process.exit(1);
    }
}

module.exports = connectDB;