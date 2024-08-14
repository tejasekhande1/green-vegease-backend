"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../controllers/Auth");
const router = express_1.default.Router();
router.post("/signup", (req, res) => (0, Auth_1.signUp)(req, res));
router.post("/login", (req, res) => (0, Auth_1.login)(req, res));
exports.default = router;
