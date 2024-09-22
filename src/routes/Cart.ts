import express from "express";
import { ValidateZod } from "../validation/utils";
import { cartSchemas } from "../validation/Cart";
import { asyncErrorHandler } from "../controllers/utils";
import { retrieveCart } from "../controllers/Cart";

const router = express.Router();

router.get(
    "/:userId",
    ValidateZod(cartSchemas.retrieveCart),
    asyncErrorHandler(retrieveCart),
);

router.post("/:cartId/items");

router.put("/:cartId/items/:itemId");

router.delete("/:cartId/items/:itemId");

router.delete("/:cartId");

router.get("/:cartId/total");

export default router;
