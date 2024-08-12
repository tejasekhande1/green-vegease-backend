const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/Auth');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const db = require('./config/database.js');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Routes
app.use("/api/v1/auth", authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        success: false,
        message: "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log("Server Listening at ", PORT);
});