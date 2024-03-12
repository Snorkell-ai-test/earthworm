import courseLinks from "~/assets/courseLinks.json";

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
// 星荣课程列表
// 由于改版，现在无法获取到课程列表
// 需要手动在浏览器调用接口获取数据
// 返回的数据结构是:
// {
//     code: 0,
//     message: "0",
//     data: {
//         aids: [...],
//         archives: [...],
//         meta: {...},
//         page: {...}
//     }
// }
// 我们需要获取的是 data.archives
// 把其放到 assets/courseLinks.json 中
// const url = 'https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?mid=160507280&season_id=48449&page_num=1&page_size=99'

export function getCourseLink(id: number) {
  return courseLinks[id].link;
}
