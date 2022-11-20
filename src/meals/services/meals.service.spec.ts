import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MealsFinderService } from './meals-finder.service';
import { MealsService } from './meals.service';

describe('MealsService', () => {
  let mealsService: MealsService;
  let mealsFinderService: MealsFinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [MealsService, MealsFinderService],
    }).compile();

    mealsService = module.get<MealsService>(MealsService);
    mealsFinderService = module.get<MealsFinderService>(MealsFinderService);
  });

  it('should be defined', () => {
    expect(mealsService).toBeDefined();
  });
});
