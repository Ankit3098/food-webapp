import Search from "./modal/Search";
import Likes from "./modal/Likes";
import Recipe from "./modal/Recipe";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as listView from "./view/listView";
import * as likesView from "./view/likesView";
import { element, renderLoader, clearLoader } from "./view/base";
import List from "./modal/List";

/** Global state of the object
 * - search object
 * - current recipe object
 * - shopping list object
 * - like recipe list
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. Get the queary
  const queary = searchView.getResult(); //TODO

  if (queary) {
    // 2. new Search Object and add to the state
    state.search = new Search(queary);

    // 3. Prepare the UI for the  result
    searchView.clearField();
    searchView.clearResult();
    renderLoader(element.searchRes);

    // 4. Search for the queary
    await state.search.getRecipe();
    clearLoader();

    // 5. Render the result on UI
    searchView.renderResult(state.search.result);
  }
};

element.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

element.searchPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  console.log(btn);
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResult(state.search.result, gotoPage);
  }
});

/**
 *
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    //  Prepare the UI
    recipeView.clearRecipe();
    renderLoader(element.recipe);
    //   Highligh the search item
    if (state.search) searchView.highLightedList(id);
    // create the object
    state.recipe = new Recipe(id);
    try {
      // get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calculate the serving and time
      state.recipe.clacTime();
      state.recipe.calcServe();
      // Update the UI
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert("error Processing recipe!");
    }
  }
};
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // if there is no list then create list
  if (!state.list) state.list = new List();

  // Add ingrediant to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// handle the delete and the update list item
element.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 * LIKE CONTROLLER
 */
// Testing

const controlLikes = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // User has NOT yet liked recipe
  if (!state.likes.isLiked(currentID)) {
    // Add the recipe to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLike(true);

    // Add like to the UI
    likesView.renderLike(newLike);
  } else {
    // User HAS like the recipe
    // Remove the recipe from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLike(false);

    // Remove like from the UI
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
// Local Storage Handler
window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
// handling the recipe button clicks

element.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrese, .btn-decrese *")) {
    // decrese the serving
    if (state.recipe.serving > 1) {
      state.recipe.updateServing("dec");
      recipeView.updateServingIng(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // decrese the serving
    state.recipe.updateServing("inc");
    recipeView.updateServingIng(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLikes();
  }
});
