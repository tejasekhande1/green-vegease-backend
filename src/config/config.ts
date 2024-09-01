const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 8000;

export const config = {
    posgres: {
        url: process.env.POSTGRES_URL as string,
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID as string,
        authToken: process.env.TWILIO_AUTH_TOKEN as string,
        service: process.env.TWILIO_SMS_SERVICE as string,
    },
    server: {
        port: SERVER_PORT,
    },
};
