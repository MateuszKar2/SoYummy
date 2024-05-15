import express, { Router } from 'express';
import { getAllIngredientControllers, getRecipesByIngredientController } from '../controllers/ingredients.controller';
const router: Router = express.Router();
/**
 * @swagger
 * /ingredients/{id}/recipes:
 *   get:
 *     summary: Retrieve an ingredient by ID
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ingredient
 *     responses:
 *       200:
 *         description: An ingredient object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Ingredient not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Ingredient not found
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/:id/recipes', getRecipesByIngredientController)

/**
 * @swagger
 * /ingredients/list:
 *   get:
 *     summary: Retrieve a list of all ingredients
 *     tags:
 *       - Ingredients
 *     responses:
 *       200:
 *         description: A list of all ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "ingredient"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/list', getAllIngredientControllers)
export default router;