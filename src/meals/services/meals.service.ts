import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { Meal } from '../entities/meal.entity';
import { MealIngredient, DetailedMealsDto } from '../dto';
import { MealMapper } from './meals.mapper';
import { MealsFinderService } from './meals-finder.service';

@Injectable()
export class MealsService {
  constructor(private readonly mealsFinderService: MealsFinderService) { }

  public async findByIngredientName(ingredientName: string): Promise<Meal[]> {
    const { data: basicData } = await this.mealsFinderService.getBasicDataByIngredientName(ingredientName)

    if (!basicData.meals?.length) {
      return [];
    }

    const ids: number[] = basicData.meals.map((meal: MealIngredient) => +meal.idMeal);
    const detailedData: AxiosResponse<DetailedMealsDto, any>[] = await this.mealsFinderService.getDetailedMealsByIds(ids);
    const meals: Meal[] = detailedData.map(detailedData => {      
      return new MealMapper(detailedData.data.meals[0]).map()
    });

    return meals;
  }
}
