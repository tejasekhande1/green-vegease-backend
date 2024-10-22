import express from "express";
import { isAdmin, authorization } from "../library/authorization";
import { addOffer, getOffers } from "../controllers/Offer";
const router = express.Router();

router.post("/", authorization, isAdmin, addOffer);
router.get("/", authorization, getOffers);

export default router;
