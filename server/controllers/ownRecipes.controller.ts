import { Request, Response } from "express";
import User from "../models/user.model";
import Recipe from "../models/recipes.model";

const saveOrDeleteOwnRecipe = async (
  req: Request & { userId?: string},
  res: Response,
  operation: String
) => {
  interface IRecipeBody {
    title: string;
    category: string;
    area: string;
    instructions: string;
    description: string;
    thumb: string;
    preview?: string;
    time?: string;
    youtube?: string;
    tags: string[];
    ingredients: string[];
    createdBy: object;
  }

  try {
    const { userId } = req;
    if (!userId) {
      res.status(400).json({ message: "User ID not provided" });
      return;
    }
    const {
      title,
      category,
      area,
      instructions,
      description,
      thumb,
      preview,
      time,
      youtube,
      ingredients,
      tags,
    } = req.body as IRecipeBody;

    let newRecipe = new Recipe({
      title: title,
      category: category,
      area: area,
      instructions: instructions,
      description: description,
      thumb: thumb,
      preview: preview,
      time: time,
      ingredients: ingredients,
      youtube: youtube,
      tags: tags,
      createdBy: userId,
    });

    await newRecipe.save();

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveOwnRecipe = async (req: Request, res: Response) => {
    
  await saveOrDeleteOwnRecipe(req, res, "$addToSet");
};
