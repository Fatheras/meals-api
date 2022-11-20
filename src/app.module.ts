import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealsFinderService } from './meals/services/meals-finder.service';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [MealsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
