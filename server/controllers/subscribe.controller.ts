import { Request, Response } from "express";
import { subscribe, unsubscribe } from "../services/subscribe.service";

/**
 * @async
 * @function subscribeController
 * @description Handles the subscription request. It takes the email from the request body and attempts to subscribe the user.
 * @param {Request} req - The request object, containing the email in the body.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A promise that resolves to the response object. The response will contain the status code, status message, and the subscriber object if the subscription is successful. If an error occurs, the response will contain the status code and the error message.
 */
const subscribeController = async (req: Request, res: Response) => {
    const { email } = req.body;
    
    try {
        const subscriber = await subscribe(email);
        return res.status(201).json({ status: "Success", code: 201, subscriber});
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * @async
 * @function unsubscribeController
 * @description Handles the unsubscription request. It takes the email from the request body and attempts to unsubscribe the user.
 * @param {Request} req - The request object, containing the email in the body.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A promise that resolves to the response object. The response will contain the status code and a success message if the unsubscription is successful. If an error occurs, the response will contain the status code and the error message.
 */
const unsubscribeController = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        await unsubscribe(email);
        return res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}

export { subscribeController, unsubscribeController}