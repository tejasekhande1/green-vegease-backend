import express from "express";
import { RequestSchemas, ValidateZod } from "../validation/utils";
import { isAdmin, authorization } from "../library/authorization";
import { addOffer } from "../controllers/Offer";
const router = express.Router();

router.post("/", authorization, isAdmin, addOffer);

export default router;
