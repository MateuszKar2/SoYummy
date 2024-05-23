import express, { Router } from "express";
import decodeToken from "../middlewares/auth/decodeToken";
import {
  getShoppingList,
  saveShoppingList,
  unsaveShoppingList,
} from "../controllers/shoppingList.controller";
const router: Router = express.Router();

/**
 * @swagger
 * /shopping-list/add:
 *   post:
 *     summary: Add an item to user's shopping list
 *     tags:
 *       - ShoppingList
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer jwt-token
 *         description: JWT token for user authentication
 *       - in: body
 *         name: shoppingList
 *         description: The shopping list item to add
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 664e5b8f4ae480142160aac0
 *             measure:
 *               type: string
 *               example: 2
 *     responses:
 *       200:
 *         description: The item was successfully added to the shopping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item added to shopping list
 *       400:
 *         description: Bad request, the user ID or item was not provided or item already in shopping list
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/add", decodeToken, saveShoppingList);
/**
 * @swagger
 * /shopping-list/get:
 *   get:
 *     summary: Get a user's shopping list
 *     tags:
 *       - ShoppingList
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer jwt-token
 *         description: JWT token for user authentication
 *     responses:
 *       200:
 *         description: The shopping list was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Apples", "Oranges", "Milk"]
 *       401:
 *         description: Unauthorized, invalid or missing JWT token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/get", decodeToken, getShoppingList);
/**
 * @swagger
 * /shopping-list/delete:
 *   delete:
 *     summary: Remove an item from user's shopping list
 *     tags:
 *       - ShoppingList
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer jwt-token
 *         description: JWT token for user authentication
 *       - in: body
 *         name: shoppingList
 *         description: The shopping list item to remove
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 664e5b8f4ae480142160aac0
 *     responses:
 *       200:
 *         description: The item was successfully removed from the shopping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item removed from shopping list
 *       400:
 *         description: Bad request, the user ID or item was not provided or item not in shopping list
 *       401:
 *         description: Unauthorized, invalid or missing JWT token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete", decodeToken, unsaveShoppingList);
export default router;
