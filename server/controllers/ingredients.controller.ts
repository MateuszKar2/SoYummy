import { Request, Response } from "express";
import Recipe from "../models/recipes.model";
import Ingredient from "../models/ingredients.model";

export const getRecipesByIngredientController = async (req: Request, res: Response) => {
    const {id} = req.params;

    if(!id) {
        res.status(400).json({message: "Please provide an ingredient"});
        return;
    }

    try {
        const recipes = await Recipe.find({"ingredients.id": id});
        if(recipes.length === 0) {
            res.status(404).json({message: "No recipes found with the provided ingredient"});
            return;
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
}

export const getAllIngredientControllers = async (req: Request, res: Response) => {
    try {
        const recipes = await Ingredient.find();
        if(!recipes) {
            res.status(404).json({message: "Ingredients not found"});
            return;
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
}