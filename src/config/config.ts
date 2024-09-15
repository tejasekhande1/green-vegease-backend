const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 8000;

export const config = {
    cloudinary:{
        cloud_name :process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET,
        folder:process.env.CLOUDINARY_FOLDER
    },
    core: {
        serviceName: process.env.SERVICE_NAME as string,
    },
    posgres: {
        url: process.env.POSTGRES_URL as string,
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID as string,
        authToken: process.env.TWILIO_AUTH_TOKEN as string,
    },
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY as string,
        sender: process.env.SENDGRID_SENDER_EMAIL as string,
        verificationTemplateId: process.env
            .SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID as string,
    },
    server: {
        port: SERVER_PORT,
    }
} 