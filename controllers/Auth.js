"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, username, mobileNumber, email, password, confirmedPassword } = req.body;
        if (!firstname || !lastname || !username || !mobileNumber || !email || !password || !confirmedPassword) {
            return res.status(400).json({
                success: false, message: 'All fields are required',
            });
        }
        if (password !== confirmedPassword) {
            return res.status(400).json({
                success: false, message: 'Passwords do not match, please try again',
            });
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { mobile_number: mobileNumber }]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false, message: 'User already exists',
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                first_name: firstname,
                last_name: lastname,
                username,
                mobile_number: mobileNumber,
                email,
                password: hashedPassword,
                profile_picture: `https://api.dicebear.com/7.x/initials/svg?seed=${firstname} ${lastname}`,
            },
        });
        return res.status(201).json({
            success: true, message: 'User registered successfully', user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile_number: user.mobile_number,
                profile_picture: user.profile_picture,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: 'Error while registering user', error: error.message,
        });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, password } = req.body;
        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Both mobile number and password are required.',
            });
        }
        const user = yield prisma.user.findUnique({
            where: { mobile_number: mobileNumber },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password.',
            });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '2h',
        });
        const userResponse = Object.assign(Object.assign({}, user), { password: undefined, token });
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };
        return res
            .cookie('token', token, cookieOptions)
            .status(200)
            .json({
            success: true,
            token,
            user: userResponse,
            message: 'User logged in successfully.',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while logging in user.',
            error: error.message,
        });
    }
});
exports.login = login;
