import { Request, Response } from "express";
import CategoryList from "../models/categoryList.model";
import Recipe from "../models/recipes.model";

export const mainPageRecipesController = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryList.find();
        let result = []

        for (let categoryDoc of categories) {
            const recipes = await Recipe.find({ category: categoryDoc.title });
            result.push({ category: categoryDoc.title, recipes: recipes })
        }

        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({ status: 'Error', message: 'Server error'})
    }
}

export const getRecipesByCategoryController = async (req: Request, res: Response) => {
    try {
        const category = req.params.category;
        const recipes = await Recipe.find({ category: category }).limit(8);  
        res.status(200).json(recipes);
    } catch(err) {
        res.status(500).json({ status: 'Error', message: 'Server error'})
    }
};

export const getRecipesByIdController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const recipe = await Recipe.findById(id);
        res.status(200).json(recipe);
    } catch(err) {
        res.status(500).json({ status: 'Error', message: 'Server error'})
    }
}