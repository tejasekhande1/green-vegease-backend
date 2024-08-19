import { v7 as uuidv7 } from "uuid";
import sgMail from "@sendgrid/mail";

function generateVerificationToken(): string {
    // Generate a UUID7
    const tokenUUID = uuidv7();

    // Remove hyphens and take the first 6 characters, convert to uppercase
    const token = tokenUUID.replace(/-/g, "").substring(0, 6).toUpperCase();

    return token;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendEmail(mailOptions: any): Promise<any> {
    return await sgMail.send(mailOptions);
}

export { generateVerificationToken, sendEmail };
