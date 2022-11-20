import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MealsModule } from '../src/meals/meals.module';
import { ConfigModule } from '@nestjs/config';
import { chickenMealsJsonMock } from './mocks/chicken-meals-json.mock';

// it would be better to mock all http requests to MealsAPI in real-world app, 
// but for testing purposes it's fine I guess
describe('MealsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MealsModule, ConfigModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('/meals?ingredient= (GET)', () => {
    it('should return meals if the ingredient name is valid', () => {
      return request(app.getHttpServer())
        .get(`/meals?ingredient=${'chicken'}`)
        .expect(HttpStatus.OK)
        .expect(chickenMealsJsonMock);
    });

    it('should return empty array if there are no meals with such ingredient name', () => {
      return request(app.getHttpServer())
        .get(`/meals?ingredient=${'absd'}`)
        .expect(HttpStatus.OK)
        .expect([]);
    });

    it('should return Bad Request if the ingredient name is empty', () => {
      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'ingredient must be longer than or equal to 2 characters',
          'ingredient should not be empty'
        ],
        error: 'Bad Request'
      }

      return request(app.getHttpServer())
        .get(`/meals?ingredient=${''}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(errorResponse)
    });

    it('should return Bad Request if the ingredient name is too short', () => {
      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'ingredient must be longer than or equal to 2 characters',
        ],
        error: 'Bad Request'
      }

      return request(app.getHttpServer())
        .get(`/meals?ingredient=${'a'}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(errorResponse)
    });

    it('should return Bad Request if the ingredient name is too long', () => {
      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'ingredient must be shorter than or equal to 20 characters',
        ],
        error: 'Bad Request'
      }

      return request(app.getHttpServer())
        .get(`/meals?ingredient=${'ajsdhkajsfhasdjkfhasdjfhsdalfkjsadfjsafjdsklfjdlk'}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(errorResponse)
    });
  })
});
