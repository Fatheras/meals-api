import { IsNotEmpty, Length } from "class-validator";

export class GetMealsByIngredientDto {
    meals?: GetMealsByIngredientItemDto[] | null;
}

export class GetMealsByIngredientItemDto {
    strMeal: string;
    strMealThumb: string;
    idMeal: string;
}

export class GetMealByIngredientQueryDto {
    @IsNotEmpty()
    @Length(2, 20)
    ingredient: string;
} 
