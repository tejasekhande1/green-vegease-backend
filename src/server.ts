import express, {Request, Response} from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import authRoutes from './routes/Auth';
import swaggerSpec from './config/swagger';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Routes
app.use("/api/v1/auth", authRoutes);

// Error Handling Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send({
        success: false,
        message: "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log("Server Listening at ", PORT);
});