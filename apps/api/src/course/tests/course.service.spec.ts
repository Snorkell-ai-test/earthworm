import { JwtModule } from '@nestjs/jwt';
import { RankService } from '../../rank/rank.service';
import { UserProgressService } from '../../user-progress/user-progress.service';
import { CourseService } from '../course.service';
import { Test } from '@nestjs/testing';
import { MockRedisModule } from '../../../test/helper/mockRedis';
import { type DbType, DB } from '../../global/providers/db.provider';
import { course, statement } from '@earthworm/shared';
import { HttpException } from '@nestjs/common';
import { createUser } from '../../../test/fixture/user';
import { GlobalModule } from '../../global/global.module';
import {
  createFirstCourse,
  createSecondCourse,
} from '../../../test/fixture/course';
import { createStatement } from '../../../test/fixture/statement';
import { cleanDB, startDB } from '../../../test/helper/utils';
import { endDB } from '../../common/db';
import { CourseHistoryService } from '../../course-history/course-history.service';

const user = createUser();
const firstCourse = createFirstCourse();
const secondCourse = createSecondCourse();

describe('course service', () => {
  let db: DbType;
  let courseService: CourseService;
  let userProgressService: UserProgressService;
  let rankService: RankService;
  let courseHistoryService: CourseHistoryService;

  beforeAll(async () => {
    const testHelper = await setupTesting();
    await setupDatabaseData(testHelper.db);

    db = testHelper.db;
    courseService = testHelper.courseService;
    userProgressService = testHelper.UserProgressService;
    rankService = testHelper.rankService;
    courseHistoryService = testHelper.courseHistoryService;
  });

  afterAll(async () => {
    await cleanDB(db);
    await endDB();
  });

  beforeEach(async () => {
    await startDB(db);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should return try course data', async () => {
    const course = await courseService.tryCourse();

    expect(course).toEqual(
      expect.objectContaining({
        ...firstCourse,
      }),
    );
    expect(course.statements.length).toBeGreaterThan(0);
  });

  it('should return course details with statements given a course ID', async () => {
    const course = await courseService.find(firstCourse.id);

    expect(course).toEqual(
      expect.objectContaining({
        ...firstCourse,
      }),
    );
    expect(course.statements.length).toBeGreaterThan(0);
  });

  it('should return an array of all courses', async () => {
    const courses = await courseService.findAll();

    expect(courses.length).toBeGreaterThan(0);
  });

  describe('findNext', () => {
    it('should return the next course given a course ID', async () => {
      const nextCourse = await courseService.findNext(firstCourse.id);

      expect(nextCourse.id).toBe(secondCourse.id);
    });

    it('should throw an exception if there is no next course', async () => {
      const courseId = 9999; // 使用一个不存在的课程 ID

      const nextCourse = courseService.findNext(courseId);

      await expect(nextCourse).rejects.toThrow(HttpException);
    });
  });

  it('should update user progress and rank after completing a course', async () => {
    const nextCourse = await courseService.completeCourse(user, firstCourse.id);

    expect(nextCourse.id).toBe(secondCourse.id);
    expect(userProgressService.update).toHaveBeenCalledWith(
      user.userId,
      secondCourse.id,
    );
    expect(rankService.userFinishCourse).toHaveBeenCalledWith(
      user.userId,
      user.username,
    );
    expect(courseHistoryService.setCompletionCount).toHaveBeenCalledWith(
      user.userId,
      firstCourse.id,
    );
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
async function setupDatabaseData(db: DbType) {
  await cleanDB(db);
  await setupDBData(db);
}

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
async function setupTesting() {
  const mockUserProgressService = {
    update: jest.fn(),
  };
  const mockRankService = {
    userFinishCourse: jest.fn(),
  };
  const mockCourseHistoryService = {
    setCompletionCount: jest.fn(),
  };

  const moduleRef = await Test.createTestingModule({
    imports: [
      GlobalModule,
      MockRedisModule,
      JwtModule.register({
        secret: process.env.SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ],
    providers: [
      CourseService,
      { provide: UserProgressService, useValue: mockUserProgressService },
      { provide: RankService, useValue: mockRankService },
      { provide: CourseHistoryService, useValue: mockCourseHistoryService },
    ],
  }).compile();

  return {
    courseService: moduleRef.get<CourseService>(CourseService),
    UserProgressService:
      moduleRef.get<UserProgressService>(UserProgressService),
    rankService: moduleRef.get<RankService>(RankService),
    courseHistoryService:
      moduleRef.get<CourseHistoryService>(CourseHistoryService),
    db: moduleRef.get<DbType>(DB),
    moduleRef,
  };
}

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
  await db.insert(course).values(secondCourse);

  await db.insert(statement).values({
    ...createStatement(firstCourse.id),
  });
}
