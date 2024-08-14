"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const Auth_1 = __importDefault(require("./routes/Auth"));
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(express.json());
app.use(cookieParser());
// Swagger Documentation
/*app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});*/
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
