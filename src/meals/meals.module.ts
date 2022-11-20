import { Module } from '@nestjs/common';
import { MealsService } from './services/meals.service';
import { MealsController } from './meals.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MealsFinderService } from './services/meals-finder.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [MealsController],
  providers: [MealsService, MealsFinderService]
})
export class MealsModule {}
