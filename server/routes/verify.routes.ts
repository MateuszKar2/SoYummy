import express, { Router } from "express";
import {
  verifyEmail,
  verifyEmailValidation,
} from "../middlewares/users/verifyEmail";
import { addContextData } from "../controllers/auth.controller";
import {
  blockLogin,
  verifyLogin,
  verifyLoginValidation,
} from "../middlewares/users/verifyLogin";
import * as useragent from "express-useragent";

const router: Router = express.Router();
router.use(useragent.express());
/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify user's email
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: query
 *         name: code
 *         description: The verification code.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         description: The user's email.
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Email verified
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error message
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
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get("/", verifyEmailValidation, verifyEmail, addContextData);

/**
 * @swagger
 * /auth/verify/login:
 *   get:
 *     summary: Verify login
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: query
 *         name: email
 *         description: The user's email.
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: id
 *         description: The suspicious login id.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Login verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login verified
 *       400:
 *         description: Invalid verification link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification link
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Could not verify your login
 */
router.get("/login", verifyLoginValidation, verifyLogin);

/**
 * @swagger
 * /auth/verify/block:
 *   get:
 *     summary: Block login
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: query
 *         name: email
 *         description: The user's email.
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: id
 *         description: The suspicious login id.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Login blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login blocked
 *       400:
 *         description: Invalid verification link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification link
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Could not block your login
 */
router.get("/block", verifyLoginValidation, blockLogin);
export default router;
