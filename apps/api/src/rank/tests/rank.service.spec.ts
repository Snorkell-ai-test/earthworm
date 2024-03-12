import { Test, TestingModule } from '@nestjs/testing';
import { RankService } from '../rank.service';
import { MockRedisModule } from '../../../test/helper/mockRedis';
import { JwtModule } from '@nestjs/jwt';
import { createUser } from '../../../test/fixture/user';
import {
  createEmptyRankList,
  createRankListWithFirstUserFinishedCourse,
  createRankListWithUserFinishedCourse2Times,
} from '../../../test/fixture/rank';

const user = createUser();
const emptyRankList = createEmptyRankList();
const firstUserFinished = createRankListWithFirstUserFinishedCourse();
const userFinishedTwice = createRankListWithUserFinishedCourse2Times();

describe('rank service', () => {
  let rankService: RankService;

  beforeEach(async () => {
    const testHelper = await setupTesting();

    rankService = testHelper.rankService;
    await rankService.resetRankList();
  });

  afterAll(async () => {
    await rankService.resetRankList();
  });

  describe('RankList', () => {
    it('should return empty rank list', async () => {
      await rankService.resetRankList();
      const res = await rankService.getRankList(user);

      expect(res).toEqual(emptyRankList);
    });

    it('should return rank list with first user finished course', async () => {
      await rankService.userFinishCourse(user.userId, user.username);
      const res = await rankService.getRankList(user);

      expect(res).toEqual(firstUserFinished);

      await rankService.resetRankList();
    });

    it('should return rank list with user finished course 2 times', async () => {
      await rankService.userFinishCourse(user.userId, user.username);
      await rankService.userFinishCourse(user.userId, user.username);
      const res = await rankService.getRankList(user);

      expect(res).toEqual(userFinishedTwice);

      await rankService.resetRankList();
    });

    it('should return empty rank list after reset', async () => {
      await rankService.userFinishCourse(user.userId, user.username);
      await rankService.resetRankList();
      const res = await rankService.getRankList(user);

      expect(res).toEqual(emptyRankList);
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
async function setupTesting() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      MockRedisModule,
      JwtModule.register({
        secret: process.env.SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ],
    providers: [RankService],
  }).compile();
  return {
    rankService: moduleRef.get<RankService>(RankService),
  };
}
