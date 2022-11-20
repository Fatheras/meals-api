import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { Injectable, InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { Meal } from './entities/meal.entity';
import { GetMealsByIngredientDto, MealIngredient, DetailedMealsDto } from './dto';
import { MealMapper } from './meals.mapper';

@Injectable()
export class MealsService {
  private readonly logger: Logger = new Logger(MealsService.name);
  private readonly baseURL: string = this.configService.get<string>('MEALS_API_BASE_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }

  public async findByIngredientName(ingredientName: string): Promise<Meal[]> {
    const { data: basicData } = await this.getBasicDataByIngredientName(ingredientName)

    if (!basicData.meals?.length) {
      return [];
    }

    const ids: number[] = basicData.meals.map((meal: MealIngredient) => +meal.idMeal);
    const detailedData: AxiosResponse<DetailedMealsDto, any>[] = await this.getDetailedMealsByIds(ids);
    const meals: Meal[] = detailedData.map(detailedData => new MealMapper(detailedData.data.meals[0]).map());

    return meals;
  }

  private getBasicDataByIngredientName(ingredientName: string) {
    if (!ingredientName) {
      throw new InternalServerErrorException('Ingredient is required');
    }
    
    const kek = firstValueFrom(
      this.httpService.get<GetMealsByIngredientDto>(`${this.baseURL}/api/json/v1/1/filter.php?i=${ingredientName}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new ServiceUnavailableException();
        })
      )
    );

    return kek;
  }

  private getDetailedMealsByIds(ids: number[]): Promise<AxiosResponse<DetailedMealsDto, any>[]> {
    if (!ids?.length) {
      throw new InternalServerErrorException('Ids are required');
    }


    const getByIdRequests: Promise<AxiosResponse<DetailedMealsDto, any>>[] = this.buildByIdRequests(ids);

    return Promise.all(getByIdRequests);
  }

  private buildByIdRequests(ids: number[]): Promise<AxiosResponse<DetailedMealsDto, any>>[] {
    const getByIdRequests = [];

    for (let id of ids) {
      const request = firstValueFrom(
        this.httpService.get<DetailedMealsDto>(`${this.baseURL}/api/json/v1/1/lookup.php?i=${id}`).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            throw new ServiceUnavailableException();
          })
        )
      );

      getByIdRequests.push(request);
    }

    return getByIdRequests;
  }
}
