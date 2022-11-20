import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { severalChickenMeals } from '../../test/mocks/several-chicken-meals.mock';
import { MealsFinderService } from './services/meals-finder.service';
import { MealsController } from './meals.controller';
import { MealsService } from './services/meals.service';

describe('MealsController', () => {
  let mealsController: MealsController;
  let mealsService: MealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      controllers: [MealsController],
      providers: [MealsService, MealsFinderService],
    }).compile();

    mealsController = module.get<MealsController>(MealsController);
    mealsService = module.get<MealsService>(MealsService);
  });

  it('should be defined', () => {
    expect(mealsController).toBeDefined();
  });

  describe('findByIngredientName', () => {
    it('should return meals if the ingredient name is valid', async () => {
      const result = severalChickenMeals;
      const dto = { ingredient: 'chicken' };
      jest.spyOn(mealsService, 'findByIngredientName').mockImplementation(async () => result);

      expect(await mealsController.findByIngredientName(dto)).toBe(result);
    });

    it('should return empty array if the ingredient name is not found', async () => {
      const result = [];
      const dto = { ingredient: 'asdasdadas' };
      jest.spyOn(mealsService, 'findByIngredientName').mockImplementation(async () => []);

      expect(await mealsController.findByIngredientName(dto)).toStrictEqual(result);
    });
  });
});
