import express from "express";
import { getUsers } from "../controllers/User";

const router = express.Router();

router.get("/", getUsers);

export default router;