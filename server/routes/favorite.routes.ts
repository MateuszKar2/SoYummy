import express, { Router } from 'express';
import { getSavedRecipes, saveRecipe, unsaveRecipe } from '../controllers/favorite.controller';
import decodeToken from '../middlewares/auth/decodeToken';
const router: Router = express.Router();

/**
 * @swagger
 * /favorite/add:
 *   post:
 *     summary: Add a recipe to user's favorites
 *     tags:
 *       - Favorite
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: 640cd5ac2d9fecf12e8897f3
 *         description: The keyword to search for in recipe titles
 *       - in: body
 *         name: favorite
 *         description: The favorite item to add
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: 66465c5dda5969f9555e4245
 *     responses:
 *       200:
 *         description: The recipe was successfully added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recipe added to favorites
 *       400:
 *         description: Bad request, the user ID or recipe ID was not provided or recipe already in favorites
 *       404:
 *         description: User or recipe not found
 *       500:
 *         description: Server error
 */
router.post('/add', saveRecipe);
/**
 * @swagger
 * /favorite/get:
 *   get:
 *     summary: Get all saved recipes for a user
 *     tags:
 *       - Favorite
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication.
 *         required: true
 *         type: string
 *         example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: A list of saved recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: User or recipes not found
 *       500:
 *         description: Server error
 */
router.get('/get', decodeToken, getSavedRecipes);
/**
 * @swagger
 * /favorite/delete:
 *   delete:
 *     summary: Remove a recipe from user's favorites
 *     tags:
 *       - Favorite
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: 640cd5ac2d9fecf12e8897f3
 *         description: The keyword to search for in recipe titles
 *       - in: body
 *         name: favorite
 *         description: The favorite item to remove
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: 66465c5dda5969f9555e4245
 *     responses:
 *       200:
 *         description: The recipe was successfully removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recipe removed from favorites
 *       400:
 *         description: Bad request, the user ID or recipe ID was not provided
 *       404:
 *         description: User or recipe not found
 *       500:
 *         description: Server error
 */
router.delete('/delete', unsaveRecipe)
export default router;