import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
const fileUpload = require("express-fileupload");
import { cloudinaryConnect } from "./config/cloudinary";

import authRoutes from "./routes/Auth";
import categoryRoutes from "./routes/Category";
import productRoutes from "./routes/Product";
import cartRoutes from "./routes/Cart";
import adminRoutes from "./routes/Admin";
import userRoutes from "./routes/User";
import swaggerSpec from "./config/swagger";
import Logging from "./library/Logging";
import { config } from "./config/config";

const app = express();

const startServer = () => {
    // log the request
    app.use((req: Request, res: Response, next: NextFunction) => {
        // log the request
        Logging.info(
            `Incomming - METHOD [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
        );

        res.on("finish", () => {
            // log the res
            Logging.info(
                `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
            );
        });

        next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
        fileUpload({
            useTempFiles: true,
            tempFileDir: "/tmp",
        }),
    );

    cloudinaryConnect();

    // rules of our API
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        );

        if (req.method == "OPTIONS") {
            res.header(
                "Access-Control-Allow-Methods",
                "PUT, POST, PATCH, DELETE, GET",
            );
            return res.status(200).json({});
        }

        next();
    });

    // Swagger Documentation
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    // Routes
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/category", categoryRoutes);
    app.use("/api/v1/product", productRoutes);
    app.use("/api/v1/cart", cartRoutes);
    app.use("/api/v1/admin", adminRoutes);
    app.use("/api/v1/user", userRoutes);

    // health-check
    app.get("/ping", (req: Request, res: Response, next: NextFunction) =>
        res.status(200).json({ hello: "world" }),
    );

    // Error Handling Middleware
    app.use(
        (
            err: Error,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            Logging.error(err.stack);
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
            });
        },
    );

    http.createServer(app).listen(config.server.port, () =>
        Logging.info(`Server is running on port ${config.server.port}`),
    );
};

startServer();
