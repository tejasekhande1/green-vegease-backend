import express from "express";
import { isAdmin, authorization } from "../library/authorization";
import {
    addOffer,
    getOffers,
    updateOffer,
    deleteOffer,
    getOfferById,
    getProductsByOfferId,
} from "../controllers/Offer";
const router = express.Router();

router.post("/", authorization, isAdmin, addOffer);

router.get("/", authorization, getOffers);

router.put("/:id", authorization, isAdmin, updateOffer);

router.delete("/:id", authorization, isAdmin, deleteOffer);

router.get("/:id", authorization, getOfferById);

router.get("/:offerId/products", authorization, getProductsByOfferId);
export default router;
