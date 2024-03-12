import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { User, UserEntity } from '../user/user.decorators';
import { AuthGuard, UncheckAuth } from '../auth/auth.guard';

@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}

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
  @UncheckAuth()
  @UseGuards(AuthGuard)
  @Get('progress')
  getRankList(@User() user: UserEntity) {
    return this.rankService.getRankList(user);
  }
}
