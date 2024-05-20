import { Request, Response } from "express";
import User from "../models/user.model";
import Recipe from "../models/recipes.model";

const saveOrUnsaveRecipe = async (
  req: Request,
  res: Response,
  operation: String
) => {
  try {
    const id = req.query.q;
    const { userId } = req.body;
    const update: { $addToSet?: any; $pull?: any } = {};
    update[operation === "$addToSet" ? "$addToSet" : "$pull"] = {
      favorites: userId,
    };
  
    const addUserToRecipes = await Recipe.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).select("favorites");
    
    if (!addUserToRecipes) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }

    if (operation === "$pull") {
      res.status(200).json({ message: "User removed from favorites" });
    } else {
      res.status(200).json({ message: "User added to favorites" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const saveRecipe = async (req: Request, res: Response) => {
  await saveOrUnsaveRecipe(req, res, "$addToSet");
};

export const unsaveRecipe = async (req: Request, res: Response) => {
  await saveOrUnsaveRecipe(req, res, "$pull");
};

export const getSavedRecipes = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const recipes = await Recipe.find({ favorites: userId });
    if (!recipes) {
      res.status(404).json({ message: "Recipes not found" });
      return;
    }

    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
