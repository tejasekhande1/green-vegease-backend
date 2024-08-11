const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require('dotenv').config();

const authRoutes = require('./routes/Auth');

const PORT = process.env.PORT || 4000;

const db = require('./config/database.js');

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.get("/", async (req, res) => {
    return res.status(200).json({
        success: true,
        message: `Server starts at ${PORT}`
    })
})

app.listen(PORT, () => {
    console.log("Server Listening at ", PORT);
});