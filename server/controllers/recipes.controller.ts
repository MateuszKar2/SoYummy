import { Request, Response } from "express";
import CategoryList from "../models/categoryList.model";
import Recipe from "../models/recipes.model";

export const mainPageRecipesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await CategoryList.find();

    if (!categories)
      return res
        .status(404)
        .json({ status: "Error", message: "Categories not found" });
    let result = [];

    for (let categoryDoc of categories) {
      const recipes = await Recipe.find({ category: categoryDoc.title });

      if (!recipes)
        return res
          .status(404)
          .json({ status: "Error", message: "Recipe not found" });
      result.push({ category: categoryDoc.title, recipes: recipes });
    }

    if (result.length === 0)
      return res
        .status(404)
        .json({ status: "Error", message: "Recipes not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Server error" });
  }
};

export const getRecipesByCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const category = req.params.category;

    if (!category)
      return res
        .status(404)
        .json({ status: "Error", message: "Category is required" });
    const recipes = await Recipe.find({ category: category }).limit(8);
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `No recipes found for category ${category}`,
      });
    }
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Server error" });
  }
};

export const getRecipesByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id)
      return res
        .status(404)
        .json({ status: "Error", message: "Recipe ID is required" });
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res
        .status(404)
        .json({ status: "Error", message: `Recipe not found for ID ${id}` });
    }

    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Server error" });
  }
};

export const getPopularRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ "favorites.0": { $exists: true } })
      .sort({ "favorites.length": -1 })
      .limit(5);
    if (recipes.length === 0) {
      res.status(404).json({ message: "No recipes with favorites found" });
    } else {
      res.status(200).json(recipes);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
