import express, { Router } from 'express';
import { getPopularRecipes } from '../controllers/recipes.controller';
const router: Router = express.Router();

/**
 * @swagger
 * /popular-recipe:
 *   get:
 *     summary: Retrieve popular recipes
 *     tags:
 *       - PopularRecipes
 *     responses:
 *       200:
 *         description: List of popular recipes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Recipe'
 *       500:
 *         description: Server Error
 */
router.get('/', getPopularRecipes)
export default router;