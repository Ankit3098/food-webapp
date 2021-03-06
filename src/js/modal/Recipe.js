import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }
  clacTime() {
    const numIng = this.ingredients.length;
    const period = Math.ceil(numIng / 3);
    this.time = period * 15;
  }
  calcServe() {
    this.serving = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoon",
      "tablespoons",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];

    const units = [...unitShort, "kg", "g"];

    const newIngredients = this.ingredients.map((el) => {
      // Uniform unit
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, units[i]);
      });
      // Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // Parse intenger into count unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => unitShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // there is unit
        // EX. 4 1/2 cups, arrCount [4,1/2] --> eval('4+1/2') --> 4.5
        // EX 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // there is mumber
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient,
        };
      } else if (unitIndex === -1) {
        // there is no unit and number
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServing(type) {
    // serving
    const newServing = type === "dec" ? this.serving - 1 : this.serving + 1;
    // ingrediant
    this.ingredients.forEach((ing) => {
      ing.count *= newServing / this.serving;
    });
    this.serving = newServing;
  }
}
