import { element } from "./base";

export const getResult = () => element.searchInput.value;

export const clearField = () => {
  element.searchInput.value = "";
};

export const limitResultTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > 17) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }

  return title;
};

export const clearResult = () => {
  element.recipeResult.innerHTML = "";
  element.searchPages.innerHTML = "";
};

export const highLightedList = (id) => {
  const resultArr = Array.from(document.querySelectorAll(".results__link"));
  resultArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`a[href*="${id}"]`)
    .classList.add("results__link--active");
};

const getRecipe = (recipe) => {
  const maekup = `
    <li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitResultTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
  element.recipeResult.insertAdjacentHTML("beforeend", maekup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto =${
  type === "prev" ? page - 1 : page + 1
}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>
`;

const renderButton = (page, numResult, resPerPage) => {
  const pages = Math.ceil(numResult / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // Shows only next button
    button = createButton(page, "next");
  } else if (page < pages) {
    // shows prev and next button both
    button = `${createButton(page, "prev")}
          ${createButton(page, "next")}`;
  } else if (page === pages && pages > 1) {
    // Shows only prev button
    button = createButton(page, "prev");
  }
  element.searchPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
  // render of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(getRecipe);

  // rendering of pagination button
  renderButton(page, recipes.length, resPerPage);
};
