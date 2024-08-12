const express = require("express");
const {RequestHandler} = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/Auth');
const swaggerSpec = require('./config/swagger');

const PORT = process.env.PORT || 4000;

const db = require('./config/database.js');

app.use(express.json());
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

app.use("/api/v1/auth", authRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns a success message with the server port.
 *     responses:
 *       200:
 *         description: Successful response with server start message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
app.get("/", async (req, res) => {
    return res.status(200).json({
        success: true, message: `Server starts at ${PORT}`
    })
})

app.listen(PORT, () => {
    console.log("Server Listening at ", PORT);
});