import request from "supertest";
import { app } from "../../server";
import * as smsService from "../../library/SMSVerification";
import { Server } from "http";

jest.mock("../../library/SMSVerification"); // Mock the smsService module

describe("sendVerificationSMS Controller", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    let testServer: Server;
    beforeAll(() => {
        testServer = app.listen(0); // Use port 0 to automatically assign an available port
      });
    
      afterAll((done) => {
        testServer.close(done); // Ensure server is closed after tests
      });

    it("should send a verification SMS successfully", async () => {
        (smsService.createVerificationSMS as jest.Mock).mockResolvedValueOnce(
            null,
        ); // Mock resolved value

        const response = await request(testServer)
            .post("/send-verification-sms")
            .send({ mobileNumber: "1234567890" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            "Verification SMS sent successfully",
        );
        expect(smsService.createVerificationSMS).toHaveBeenCalledWith(
            "1234567890",
        );
    });

    it("should handle errors when sending verification SMS", async () => {
        const error = new Error("Failed to send SMS");
        (smsService.createVerificationSMS as jest.Mock).mockRejectedValueOnce(
            error,
        ); // Mock rejection

        const response = await request(testServer)
            .post("/send-verification-sms")
            .send({ mobileNumber: "1234567890" });

        expect(response.status).toBe(500); // Expecting a 500 status code if error middleware is handling it
        expect(response.body.message).toBe("Internal Server Error");
        expect(smsService.createVerificationSMS).toHaveBeenCalledWith(
            "1234567890",
        );
    });

    it("should return 400 if mobileNumber is not provided", async () => {
        const response = await request(testServer)
            .post("/send-verification-sms")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("mobileNumber is required.");
        expect(smsService.createVerificationSMS).not.toHaveBeenCalled();
    });
});
