import { DetailedMeal } from "./dto/detailed-meals.dto";
import { Ingredient } from "./entities/ingredient.entity";
import { Meal } from "./entities/meal.entity";
import { strIngredients, strMeasures } from "./meals.constants";

export class MealMapper {
    private meal: Meal = new Meal();
    constructor(private readonly detailedMeal: DetailedMeal) {}

    public map() {
        this.meal.id = +this.detailedMeal.idMeal;
        this.meal.name = this.detailedMeal.strMeal;
        this.meal.instructions = this.detailedMeal.strInstructions;
        this.meal.tags = this.detailedMeal.strTags?.split(',');
        this.meal.thumbUrl = this.detailedMeal.strMealThumb;
        this.meal.youtubeUrl = this.detailedMeal.strYoutube;
        this.meal.ingredients = this.getIngredients();
        
        return this.meal;
    }

    private getIngredients() {
        const ingredients: Ingredient[] = [];

        // loop through the array until any of the strIngredients is null
        for (let i = 0; i < strIngredients.length; i++) {
            if (this.detailedMeal[strIngredients[i]]) {
                const ingredient = {
                    ingredient: this.detailedMeal[strIngredients[i]], 
                    measurement: this.detailedMeal[strMeasures[i]]
                };

                ingredients.push(ingredient)
            } else {
                break;
            }
        }

        return ingredients;
    }
}