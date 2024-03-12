import { Inject, Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { DB, DbType } from '../global/providers/db.provider';
import { UserProgressService } from '../user-progress/user-progress.service';
import { UserEntity } from '../user/user.decorators';

@Injectable()
export class GameService {
  constructor(
    @Inject(DB) private db: DbType,
    private readonly courseService: CourseService,
    private readonly userProgressService: UserProgressService,
  ) {}

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
  async startGame(user: UserEntity) {
    const { courseId } = await this.userProgressService.findOne(user.userId);
    const { id } = await this.courseService.getFirstCourse();

    if (!courseId) {
      await this.userProgressService.create(user.userId, id);
      return {
        cId: id,
      };
    }

    return { cId: courseId };
  }
}
