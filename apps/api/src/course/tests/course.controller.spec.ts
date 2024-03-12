import { JwtModule } from '@nestjs/jwt';
import { RankService } from '../../rank/rank.service';
import { UserProgressService } from '../../user-progress/user-progress.service';
import { CourseController } from '../course.controller';
import { CourseService } from '../course.service';
import { Test } from '@nestjs/testing';
import { MockRedisModule } from '../../../test/helper/mockRedis';
import { createUser } from '../../../test/fixture/user';
import { createFirstCourse } from '../../../test/fixture/course';
import { GlobalModule } from '../../global/global.module';

const user = createUser();
const course = createFirstCourse();

describe('Course', () => {
  let courseController: CourseController;
  let courseService: CourseService;

  beforeEach(async () => {
    const testHelper = await setupTesting();
    courseController = testHelper.courseController;
    courseService = testHelper.courseService;
  });

  it('should return try course data', async () => {
    const res = await courseController.tryCourse();

    expect(res).toEqual(course);
    expect(courseService.tryCourse).toHaveBeenCalled();
  });

  it('should return first course statements', async () => {
    const res = await courseController.findOne(1);

    expect(res).toEqual(course);
    expect(courseService.find).toHaveBeenCalled();
  });

  it('should return all courses', async () => {
    const res = await courseController.findAll();

    expect(res.length).toBeGreaterThan(0);
    expect(courseService.findAll).toHaveBeenCalled();
  });

  it('should return next course for findNext', async () => {
    const res = await courseController.findNext(1);

    expect(res).toEqual({ id: 2 });
    expect(courseService.findNext).toHaveBeenCalledWith(1);
  });

  it('should call completeCourse on service when completeCourse is called', async () => {
    const res = await courseController.completeCourse(user, 1);

    expect(res).toEqual({ id: 2 });
    expect(courseService.completeCourse).toHaveBeenCalledWith(user, 1);
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
async function setupTesting() {
  const mockCourseService = {
    find: jest.fn(() => course),
    findAll: jest.fn(() => [{}, {}]), // 假设有两个课程
    findNext: jest.fn((id) => ({ id: id + 1 })),
    completeCourse: jest.fn((user, id) => ({
      id: id + 1,
    })),
    startCourse: jest.fn(),
    tryCourse: jest.fn(() => course),
  };

  const moduleRef = await Test.createTestingModule({
    imports: [
      MockRedisModule,
      GlobalModule,
      JwtModule.register({
        secret: process.env.SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ],
    providers: [
      { provide: CourseService, useValue: mockCourseService },
      UserProgressService,
      RankService,
    ],
    controllers: [CourseController],
  }).compile();

  return {
    courseController: moduleRef.get<CourseController>(CourseController),
    courseService: moduleRef.get<CourseService>(CourseService),
  };
}
