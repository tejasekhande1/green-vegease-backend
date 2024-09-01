import twilio from "twilio";
import { config } from "../config/config";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

const serviceName = config.core.serviceName;
const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const client = twilio(accountSid, authToken);

export enum SMSVerificationStatus {
    APPROVED = "approved",
    PENDING = "pending",
}

export async function createVerificationSMS(
    mobileNumber: string,
): Promise<VerificationInstance> {
    return client.verify.v2.services(serviceName).verifications.create({
        channel: "sms",
        to: mobileNumber,
        locale: "en",
    });
}

export async function createVerificationCheck(
    code: string,
    mobileNumber: string,
): Promise<VerificationCheckInstance> {
    return await client.verify.v2
        .services(serviceName)
        .verificationChecks.create({
            code: code,
            to: mobileNumber,
        });
}
