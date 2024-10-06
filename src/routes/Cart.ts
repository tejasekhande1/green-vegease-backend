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

/**
 * @openapi
 * /api/v1/cart/{userId}:
 *   get:
 *     summary: Retrieve cart
 *     description: Retrieve the cart for a user by their UUID.
 *     tags: 
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UUID of the user to retrieve the cart for.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Successfully retrieved cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cart retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The cart ID.
 *                     userId:
 *                       type: string
 *                       description: The user ID associated with the cart.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the cart was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the cart was last updated.
 *                     items:
 *                       type: array
 *                       description: List of items in the cart.
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             description: The product ID.
 *                           product:
 *                             type: object
 *                             properties:
 *                               category:
 *                                 type: object
 *                                 description: Product category details.
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     description: Category ID.
 *                                   name:
 *                                     type: string
 *                                     description: Category name.
 *       '400':
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters.
 *                 error:
 *                   type: object
 *       '404':
 *         description: Cart or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart or user not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
router.get(
    "/:userId",
    ValidateZod(ParamsSchemas.cart.retrieveCart, "params"),
    ValidateZod(RequestSchemas.cart.retrieveCart),
    asyncErrorHandler(retrieveCart),
);

/**
 * @openapi
 * /api/v1/cart/{cartId}/items:
 *   post:
 *     summary: Add item to cart
 *     description: Add a new item to the cart by providing the product ID and quantity.
 *     tags: 
 *       - Cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         description: UUID of the cart to add the item to.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       description: Product and quantity to add to the cart.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: UUID of the product to add to the cart.
 *                 format: uuid
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product to add.
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       '201':
 *         description: Item added to cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item added to cart successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The cart item ID.
 *                     productId:
 *                       type: string
 *                       description: The product ID.
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the product in the cart.
 *                     cartId:
 *                       type: string
 *                       description: The cart ID.
 *       '400':
 *         description: Item already exists in cart or invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Item already exists in cart.
 *                 error:
 *                   type: object
 *       '404':
 *         description: Cart or product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart or product not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
router.post(
    "/:cartId/items",
    ValidateZod(ParamsSchemas.cart.addCartItem, "params"),
    ValidateZod(RequestSchemas.cart.addCartItem),
    asyncErrorHandler(addCartItem),
);

/**
 * @openapi
 * /api/v1/cart/{cartId}/items/{itemId}:
 *   put:
 *     summary: Update cart item
 *     description: Update the quantity of an item in the cart by its ID.
 *     tags: 
 *       - Cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         description: UUID of the cart to update the item in.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: itemId
 *         in: path
 *         description: UUID of the cart item to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       description: Data to update the item quantity.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: New quantity for the cart item.
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Item updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Cart item ID.
 *                     quantity:
 *                       type: number
 *                       description: Updated quantity of the item.
 *       '400':
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters.
 *                 error:
 *                   type: object
 *       '404':
 *         description: Cart or cart item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart item not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
router.put(
    "/:cartId/items/:itemId",
    ValidateZod(ParamsSchemas.cart.updateCartItem, "params"),
    ValidateZod(RequestSchemas.cart.updateCartItem),
    asyncErrorHandler(updateCartItem),
);

/**
 * @openapi
 * /api/v1/cart/{cartId}/items/{itemId}:
 *   delete:
 *     summary: Delete item from cart
 *     description: Remove an item from the cart by its item ID.
 *     tags: 
 *       - Cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         description: UUID of the cart from which the item will be deleted.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: itemId
 *         in: path
 *         description: UUID of the item to be deleted from the cart.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Item deleted successfully. No content in response body.
 *       '400':
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters.
 *                 error:
 *                   type: object
 *       '404':
 *         description: Cart or item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart or item not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
router.delete(
    "/:cartId/items/:itemId",
    ValidateZod(ParamsSchemas.cart.deleteCartItem, "params"),
    ValidateZod(RequestSchemas.cart.deleteCartItem),
    asyncErrorHandler(deleteCartItem),
);

/**
 * @openapi
 * /api/v1/cart/{cartId}:
 *   delete:
 *     summary: Clear cart
 *     description: Remove all items from the cart by its cart ID.
 *     tags: 
 *       - Cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         description: UUID of the cart to clear all items.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Cart cleared successfully. No content in response body.
 *       '400':
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters.
 *                 error:
 *                   type: object
 *       '404':
 *         description: Cart not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
router.delete(
    "/:cartId",
    ValidateZod(ParamsSchemas.cart.clearCart, "params"),
    ValidateZod(RequestSchemas.cart.clearCart),
    asyncErrorHandler(clearCart),
);

/**
 * @openapi
 * /api/v1/cart/{cartId}/total:
 *   get:
 *     summary: Get cart total
 *     description: Retrieve the total price of all items in the cart by its cart ID.
 *     tags: 
 *       - Cart
 *     parameters:
 *       - name: cartId
 *         in: path
 *         description: UUID of the cart to retrieve the total price.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Successfully retrieved cart total.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: The total price of the cart.
 *       '400':
 *         description: Invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters.
 *                 error:
 *                   type: object
 *       '404':
 *         description: Cart not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
router.get(
    "/:cartId/total",
    ValidateZod(ParamsSchemas.cart.getCartTotal, "params"),
    ValidateZod(RequestSchemas.cart.getCartTotal),
    asyncErrorHandler(getCartTotal),
);

export default router;
