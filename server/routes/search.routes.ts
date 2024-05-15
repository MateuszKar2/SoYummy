import express, { Router } from 'express';
import { searchRecipes } from '../controllers/search.controller';
const router: Router = express.Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for recipes by a keyword in the title
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The keyword to search for in recipe titles
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: No recipes found for the provided keyword
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
 *                   example: No recipes found for the provided keyword
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
router.get('/', searchRecipes);
export default router;