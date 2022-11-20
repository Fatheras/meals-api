import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { Injectable, InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { GetMealsByIngredientDto, DetailedMealsDto } from '../dto';

@Injectable()
export class MealsFinderService {
  private readonly logger: Logger = new Logger(MealsFinderService.name);
  private readonly baseURL: string = this.configService.get<string>('MEALS_API_BASE_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }


  public getBasicDataByIngredientName(ingredientName: string): Promise<any> {
    if (!ingredientName) {
      throw new InternalServerErrorException('Ingredient is required');
    }

    return firstValueFrom(
      this.httpService.get<GetMealsByIngredientDto>(`${this.baseURL}/api/json/v1/1/filter.php?i=${ingredientName}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new ServiceUnavailableException();
        })
      )
    );
  }

  public getDetailedMealsByIds(ids: number[]): Promise<AxiosResponse<DetailedMealsDto, any>[]> {
    if (!ids?.length) {
      throw new InternalServerErrorException('Ids are required');
    }


    const getByIdRequests: Promise<AxiosResponse<DetailedMealsDto, any>>[] = this.buildByIdRequests(ids);

    return Promise.all(getByIdRequests);
  }

  public buildByIdRequests(ids: number[]): Promise<AxiosResponse<DetailedMealsDto, any>>[] {
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
