import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app/app.module';
import { INestApplication } from '@nestjs/common';
import { cleanDB, signup } from '../../../test/helper/utils';
import { DbType, DB } from '../../global/providers/db.provider';
import {
  createFirstCourse,
  createSecondCourse,
} from '../../../test/fixture/course';
import { createStatement } from '../../../test/fixture/statement';
import { course, statement } from '@earthworm/shared';
import { endDB } from '../../common/db';
import * as request from 'supertest';

const firstCourse = createFirstCourse();

describe('course e2e', () => {
  let app: INestApplication;
  let db: DbType;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    db = moduleFixture.get<DbType>(DB);

    await app.init();

    await cleanDB(db);
    await setupDBData(db);

    const signupBody = await signup(app);
    token = signupBody.token;
  });

  afterEach(async () => {
    await cleanDB(db);
    await endDB();
    await app.close();
  });

  it('should fetch superhero details', async () => {
    return request(app.getHttpServer())
      .get('/courses/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            id: firstCourse.id,
            title: firstCourse.title,
          }),
        );
        expect(body.statements.length).toBeGreaterThan(0);
      });
  });

  it('should allow trying a course without authentication', async () => {
    await request(app.getHttpServer())
      .get('/courses/try')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            id: firstCourse.id,
            title: firstCourse.title,
          }),
        );
        expect(body.statements.length).toBeGreaterThan(0);
      });
  });
});

/**
 * Transforms the sign-up request data to match the backend's expected format.
 * 
 * @param {SignUpRequest} signUpData - The original sign-up request data.
 * 
 * @returns {Object} The transformed sign-up request data with the following changes:
 * - `firstName` is mapped to `first_name`
 * - `lastName` is mapped to `last_name`
 * - `email` is mapped to `username`
 * - All other properties remain unchanged.
 * 
 * @example
 * const originalData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   password: 'securePassword123'
 * };
 * 
 * const transformedData = transformSignUpRequestForBackend(originalData);
 * console.log(transformedData);
 * // Outputs:
 * // {
 * //   firstName: 'John',
 * //   lastName: 'Doe',
 * //   email: 'john.doe@example.com',
 * //   password: 'securePassword123',
 * //   first_name: 'John',
 * //   last_name: 'Doe',
 * //   username: 'john.doe@example.com'
 * // }
 */
async function setupDBData(db: DbType) {
  await db.insert(course).values(firstCourse);
  await db.insert(course).values(createSecondCourse());

  await db.insert(statement).values({
    ...createStatement(firstCourse.id),
  });
}
