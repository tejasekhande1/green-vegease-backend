import express from "express";
import { RequestSchemas, ValidateZod } from "../validation/utils";
import { asyncErrorHandler } from "../controllers/utils";
import {
    retrieveCart,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    clearCart,
    getCartTotal,
} from "../controllers/Cart";

const router = express.Router();

router.get(
    "/:userId",
    ValidateZod(RequestSchemas.cart.retrieveCart),
    asyncErrorHandler(retrieveCart),
);

router.post(
    "/:cartId/items",
    ValidateZod(RequestSchemas.cart.addCartItem),
    asyncErrorHandler(addCartItem),
);

router.put(
    "/:cartId/items/:itemId",
    ValidateZod(RequestSchemas.cart.updateCartItem),
    asyncErrorHandler(updateCartItem),
);

router.delete(
    "/:cartId/items/:itemId",
    ValidateZod(RequestSchemas.cart.deleteCartItem),
    asyncErrorHandler(deleteCartItem),
);

router.delete(
    "/:cartId",
    ValidateZod(RequestSchemas.cart.clearCart),
    asyncErrorHandler(clearCart),
);

router.get(
    "/:cartId/total",
    ValidateZod(RequestSchemas.cart.getCartTotal),
    asyncErrorHandler(getCartTotal),
);

export default router;
