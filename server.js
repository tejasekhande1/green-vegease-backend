"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const Auth_1 = __importDefault(require("./routes/Auth"));
const swagger_1 = __importDefault(require("./config/swagger"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(express_1.default.json());
app.use(cookieParser());
// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger_1.default));
app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.default);
});
// Routes
app.use("/api/v1/auth", Auth_1.default);
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
