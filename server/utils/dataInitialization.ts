import recipesData from "../data/recipes.json";
import categoriesListData from "../data/categoriesList.json";
import ingredientsData from "../data/ingredients.json";
import CategoryList from "../models/categoryList.model";
import Recipe from "../models/recipes.model";
import Ingredient from "../models/ingredients.model";

const initializeRecipes = async () => {
  for (const recipe of recipesData) {
    const existingRecipe = await Recipe.findOne({title: recipe.title});
    if (!existingRecipe) {
      const newRecipe = new Recipe({
        title: recipe.title,
        category: recipe.category,
        area: recipe.area,
        instructions: recipe.instructions,
        description: recipe.description,
        thumb: recipe.thumb,
        preview: recipe.preview,
        time: recipe.time,
        favorites: recipe.favorites,
        youtube: recipe.youtube,
        tags: recipe.tags,
        timestamp: new Date(Number(recipe.createdAt.$date.$numberLong)),
        ingredients: recipe.ingredients.map((ingredient) => ({
          id: ingredient.id.$oid,
          measure: ingredient.measure,
        })),
      });
      await newRecipe.save();
    }
  }
};

const initializeCategoryList = async () => {
  for (const category of categoriesListData) {
    const existingCategory = await CategoryList.findById(category._id);
    if (!existingCategory) {
      const newCategory = new CategoryList({
        _id: category._id,
        title: category.title,
        thumb: category.thumb,
        description: category.description,
      });
      await newCategory.save();
    }
  }
};

const initializeIngredients = async () => {
  for (const ingredient of ingredientsData) {
    const existingIngredients = await Ingredient.findOne({title: ingredient.title});
    if (!existingIngredients) {
      const newIngredient = new Ingredient({
        title: ingredient.title,
        description: ingredient.description,
        type: ingredient.type,
        thumbnail: ingredient.thumbnail,
      });
      
      await newIngredient.save();
    }
  }
};
export const initializeData = async () => {
  await Promise.all([initializeCategoryList(), initializeRecipes(), initializeIngredients()]);
};
