import swaggerJsdoc, {Options} from 'swagger-jsdoc';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Green Vegease API Documentation',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8000/',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;