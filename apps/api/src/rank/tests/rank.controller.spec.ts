import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from '../rank.controller';
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

describe('rank controller', () => {
  let rankController: RankController;
  let rankService: RankService;

  beforeEach(async () => {
    const testHelper = await setupTesting();

    rankService = testHelper.rankService;
    rankController = testHelper.rankController;
  });

  it('should return empty rank list', async () => {
    const result = emptyRankList;
    jest
      .spyOn(rankService, 'getRankList')
      .mockImplementation(async () => result);

    const res = await rankController.getRankList(user);
    expect(res).toBe(result);
    expect(rankService.getRankList).toHaveBeenCalled();
  });

  it('should return rank list with first user finished course', async () => {
    const result = userFinishedTwice;
    jest
      .spyOn(rankService, 'getRankList')
      .mockImplementation(async () => result);

    const res = await rankController.getRankList(user);
    expect(res).toBe(result);
    expect(rankService.getRankList).toHaveBeenCalled();
  });

  it('should return rank list with user finished course 2 times', async () => {
    const result = firstUserFinished;
    jest
      .spyOn(rankService, 'getRankList')
      .mockImplementation(async () => result);

    const res = await rankController.getRankList(user);
    expect(res).toBe(result);
    expect(rankService.getRankList).toHaveBeenCalled();
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
  const mockRankService = {
    getRankList: jest.fn(() => {
      return firstUserFinished;
    }),
  };

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      MockRedisModule,
      JwtModule.register({
        secret: process.env.SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ],
    controllers: [RankController],
    providers: [
      {
        provide: RankService,
        useValue: mockRankService,
      },
    ],
  }).compile();
  return {
    rankController: moduleRef.get<RankController>(RankController),
    rankService: moduleRef.get<RankService>(RankService),
  };
}
