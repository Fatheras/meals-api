import { Controller, Get, Query } from '@nestjs/common';
import { GetMealByIngredientQueryDto } from './dto/get-meals-by-ingredient.dto';
import { MealsService } from './services/meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  findByIngredientName(@Query() { ingredient }: GetMealByIngredientQueryDto) {    
    return this.mealsService.findByIngredientName(ingredient);
  }
}
