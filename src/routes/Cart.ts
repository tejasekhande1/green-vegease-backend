import express from "express";

const router = express.Router();

router.get("/:userId");

router.post("/:cartId/items");

router.put("/:cartId/items/:itemId");

router.delete("/:cartId/items/:itemId");

router.delete("/:cartId");

router.get("/:cartId/total");

export default router;
