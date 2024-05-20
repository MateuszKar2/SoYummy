import express, { Router } from "express";
import decodeToken from "../middlewares/auth/decodeToken";
import { saveOwnRecipe } from "../controllers/ownRecipes.controller";
const router: Router = express.Router();
/**
 * @swagger
 * /ownRecipes/add:
 *   post:
 *     summary: Add a new recipe
 *     tags:
 *       - OwnRecipes
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication.
 *         required: true
 *         type: string
 *         example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       - in: body
 *         name: recipe
 *         description: Recipe data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Spaghetti Carbonara"
 *             category:
 *               type: string
 *               example: "Pasta"
 *             description:
 *               type: string
 *               example: "Spaghetti Carbonara is a classic Italian dish made with eggs, cheese, pancetta, and pepper. It's creamy, delicious, and comforting."
 *             ingredients:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Ingredient'
 *               example: [{'id':'6647d64af334633cfd67833b', 'measure':'2'},{'id':'6647d64bf334633cfd678349','measure':'3'}]
 *             instructions:
 *               type: string
 *               example: "Start by dicing the pancetta and frying it in a pan with a little bit of oil until it becomes crispy. In the meantime, whisk the eggs in a bowl and mix in the grated cheese.\r\n\r\nCook the spaghetti in a large pot of boiling, salted water according to the package instructions. Once the spaghetti is al dente, reserve some pasta water and then drain the spaghetti.\r\n\r\nAdd the drained spaghetti to the pan with the pancetta and mix well. Remove the pan from the heat and add the egg and cheese mixture, stirring quickly to create a creamy sauce. If the sauce is too thick, add a bit of the reserved pasta water.\r\n\r\nSeason with salt and pepper to taste. Serve the Spaghetti Carbonara in warm bowls, sprinkling additional cheese on top if desired."
 *             area:
 *               type: string
 *               example: "Italian"
 *             thumb:
 *               type: string
 *               example: "https://www.themealdb.com/images/category/vegan.png"
 *             time:
 *               type: string
 *               example: "30"
 *             preview:
 *               type: string
 *               example: "https://ftp.goit.study/img/so-yummy/preview/Spaghetti%20Bolognese.jpg"
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Pasta", "Meat"]
 *     responses:
 *       200:
 *         description: Recipe added successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post("/add", decodeToken, saveOwnRecipe);
router.delete("/delete");
export default router;
