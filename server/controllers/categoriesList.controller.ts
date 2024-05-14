import { Request, Response } from "express";
import CategoryList from "../models/categoryList.model";

const categoryListController = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryList.find();   
        res.json(categories)
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}

export default categoryListController