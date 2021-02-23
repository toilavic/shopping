require('dotenv').config();

const productsData = require('./data/productData');
const connectDB = require('./config/db')
const Product = require('./models/products');

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany({});

        await Product.insertMany(productsData);
        console.log("Data Import Success");

        process.exit();
    } catch (error) {
        console.error("Error with data import")
        process.exit(1);
    }
}

importData();