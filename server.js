require('dotenv').config();
const cors = require("cors");
const express = require('express');
const connectDB = require('./config/db');

const usersRouter = require("./controller/users");
const loginRouter = require("./controller/login");
const itemsRouter = require("./controller/items");

const middleware = require("./utils/middleware");
connectDB();

const app = express();
app.use(cors())
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.get("/", (req, res) => {
    res.send("Shopping app");
});

app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/items", itemsRouter);


app.use(middleware.unknownEndpoint); // handles unkown endpoints
app.use(middleware.errorHandler); // handles known errors

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

