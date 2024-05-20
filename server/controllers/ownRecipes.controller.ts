import { Request, Response } from "express";
import User from "../models/user.model";
import Recipe, { RecipeDocument } from "../models/recipes.model";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const createOwnRecipe = async (
  req: Request & { userId?: string },
  res: Response
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

export const deleteOwnRecipe = async (
  req: Request & { userId?: String },
  res: Response
) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(400).json({ message: "User ID not provided" });
      return;
    }
    const { id } = req.body;
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOwnRecipes = async (
  req: Request & { userId?: String },
  res: Response
) => {
  try {
    const { userId } = req;
    const limit = String(req.query.limit || "10");
    const skip = String(req.query.skip || "0");

    if (!userId) {
      res.status(400).json({ message: "User ID not provided" });
      return;
    }

    const recipes = await Recipe.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const formattedRecipes = recipes.map((recipe) => ({
      ...recipe,
      createdAt: dayjs(recipe.createdAt).fromNow(),
    }));

    const totalRecipes = await Recipe.countDocuments({ createdBy: userId });
    res.status(200).json({
      formattedRecipes,
      totalRecipes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
