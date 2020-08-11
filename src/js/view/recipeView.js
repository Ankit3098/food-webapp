import { element } from "./base";
import { Fraction } from "fractional";

export const clearRecipe = () => {
  element.recipe.innerHTML = "";
};

const formateCount = (count) => {
  if (count) {
    // 2.5 --> 2 1/2
    // 0.5 --> 1/2
    const newCount = Math.round(count * 10000) / 10000;
    const [int, decimal] = newCount
      .toString()
      .split(".")
      .map((el) => parseInt(el));
    if (!decimal) {
      return newCount;
    }
    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return "?";
};

const createIngredient = (ingredient) => `

<li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formateCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.ingredient}
    </div>
</li>
`;

export const renderRecipe = (recipe, isLiked) => {
  const maekup = `
    <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
    </figure>
    <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${
                  recipe.time
                }</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${
                  recipe.serving
                }</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrese">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${
                      isLiked ? "" : "-outlined "
                    }"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map((el) => createIngredient(el)).join("")}
            </ul>
                
            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${
                  recipe.author
                }</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${
              recipe.url
            }" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
</div>
    `;
  element.recipe.insertAdjacentHTML("afterbegin", maekup);
};

export const updateServingIng = (recipe) => {
  // serving
  document.querySelector(".recipe__info-data--people").textContent =
    recipe.serving;
  // update ingrediant and count
  const countElement = Array.from(document.querySelectorAll(".recipe__count"));
  console.log(countElement);
  countElement.forEach((el, i) => {
    el.textContent = formateCount(recipe.ingredients[i].count);
  });
};