import { Request, Response } from "express";
import Recipe from "../models/recipes.model";

export const searchRecipes = async (req: Request, res: Response) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    res.status(400).json({ message: "Please provide a keyword" });
    return;
  }

  try {
    const recipe = await Recipe.find({
      title: { $regex: searchQuery, $options: "i" },
    });
    if (!recipe) {
      res
        .status(404)
        .json({ message: "No recipes found with the provided keyword" });
      return;
    }
    res.status(200).json({ message: "Recipe found", recipe: recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
