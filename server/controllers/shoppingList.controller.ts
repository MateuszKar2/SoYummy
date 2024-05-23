import { Request, Response } from "express";
import User from "../models/user.model";

export const saveShoppingList = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { userId } = req;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const { id, measure } = req.body;

    if (!id || !measure) {
      return res.status(400).json({ message: "Item ID and measure are required" });
    }
    const addShoppingListToUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { shoppingList: { id, measure } } },
      {
        new: true,
      }
    ).select("shoppingList");

    if (!addShoppingListToUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Item added to shopping list" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unsaveShoppingList = async (req: Request & {userId?: string}, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const removeShoppingListFromUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { shoppingList: { _id } } },
      { new: true }
    ).select("shoppingList");

    if (!removeShoppingListFromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Item removed from shopping list" });
  } catch (err) {   
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShoppingList = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("shoppingList");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} not found` });
    }
    if (!user.shoppingList || user.shoppingList.length === 0) {
      return res.status(404).json({
        message: `Shopping list for user with id ${userId} not found`,
      });
    }
    const shoppingList = user.shoppingList;

    res.status(200).json(shoppingList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
