import express from "express";
import {
    ParamsSchemas,
    RequestSchemas,
    ValidateZod,
} from "../validation/utils";
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
    ValidateZod(ParamsSchemas.cart.retrieveCart, "params"),
    ValidateZod(RequestSchemas.cart.retrieveCart),
    asyncErrorHandler(retrieveCart),
);

router.post(
    "/:cartId/items",
    ValidateZod(ParamsSchemas.cart.addCartItem, "params"),
    ValidateZod(RequestSchemas.cart.addCartItem),
    asyncErrorHandler(addCartItem),
);

router.put(
    "/:cartId/items/:itemId",
    ValidateZod(ParamsSchemas.cart.updateCartItem, "params"),
    ValidateZod(RequestSchemas.cart.updateCartItem),
    asyncErrorHandler(updateCartItem),
);

router.delete(
    "/:cartId/items/:itemId",
    ValidateZod(ParamsSchemas.cart.deleteCartItem, "params"),
    ValidateZod(RequestSchemas.cart.deleteCartItem),
    asyncErrorHandler(deleteCartItem),
);

router.delete(
    "/:cartId",
    ValidateZod(ParamsSchemas.cart.clearCart, "params"),
    ValidateZod(RequestSchemas.cart.clearCart),
    asyncErrorHandler(clearCart),
);

router.get(
    "/:cartId/total",
    ValidateZod(ParamsSchemas.cart.getCartTotal, "params"),
    ValidateZod(RequestSchemas.cart.getCartTotal),
    asyncErrorHandler(getCartTotal),
);

export default router;
