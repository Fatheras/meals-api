import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, ConfigModule, HttpModule],
  controllers: [MealsController],
  providers: [MealsService]
})
export class MealsModule {}
