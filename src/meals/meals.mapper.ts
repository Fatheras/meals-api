import { DetailedMeal } from "./dto/detailed-meals.dto";
import { Ingredient } from "./entities/ingredient.entity";
import { Meal } from "./entities/meal.entity";
import { strIngredients, strMeasures } from "./meals.constants";

export class MealMapper {
    private meal: Meal = new Meal();
    constructor(private readonly lookupMeal: DetailedMeal) {}

    public map() {
        this.meal.id = +this.lookupMeal.idMeal;
        this.meal.name = this.lookupMeal.strMeal;
        this.meal.instructions = this.lookupMeal.strInstructions;
        this.meal.tags = this.lookupMeal.strTags?.split(',');
        this.meal.thumbUrl = this.lookupMeal.strMealThumb;
        this.meal.youtubeUrl = this.lookupMeal.strYoutube;
        this.meal.ingredients = this.getIngredients();
        
        return this.meal;
    }

    private getIngredients() {
        const ingredients: Ingredient[] = [];

        // loop through the array until any of the strIngredients is null
        for (let i = 0; i < strIngredients.length; i++) {
            if (this.lookupMeal[strIngredients[i]]) {
                const ingredient = {
                    ingredient: this.lookupMeal[strIngredients[i]], 
                    measurement: this.lookupMeal[strMeasures[i]]
                };

                ingredients.push(ingredient)
            } else {
                break;
            }
        }

        return ingredients;
    }
}