import Express from "express";
import authRouter from "./auth.routes";
import subscribeRouter from "./subscribe.routes";
import verifyRouter from "./verify.routes";
import recipesRouter from "./recipes.routes";
import ingredientsRouter from "./ingredients.routes";
import searchRouter from "./search.routes";
import favoriteRouter from "./favorite.routes";
import ownRecipteRouter from "./ownRecipes.routes";
import popularRecipes from "./popularRecipe.routes";
import shoppingListRouter from "./shoppingList.routes";

export default function (app: Express.Application) {
  app.use("/auth/users", authRouter);
  app.use("/auth/subscribe", subscribeRouter);
  app.use("/auth/verify", verifyRouter);
  app.use("/recipes", recipesRouter);
  app.use("/search", searchRouter);
  app.use("/ingredients", ingredientsRouter);
  app.use("/favorite", favoriteRouter);
  app.use("/ownRecipes", ownRecipteRouter);
  app.use("/popular-recipe", popularRecipes);
  app.use("/shopping-list", shoppingListRouter);
}
