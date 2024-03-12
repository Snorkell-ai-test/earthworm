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
export function convertTitleToNumber(title: string): string {
  title = title.replace(/第|课/g, "");

  const numMap: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };

  const parts = title.split(".");

  let result = parts.map((part) => {
    if (!part) return "0";
    if (part === "十") return "10";

    let num = 0;
    if (part.startsWith("十")) {
      num = 10 + (numMap[part[1]] || 0);
    } else if (part.endsWith("十")) {
      num = (numMap[part[0]] || 0) * 10;
    } else if (part.includes("十")) {
      const [tenBefore, tenAfter] = part.split("十");
      num = (numMap[tenBefore] || 0) * 10 + (numMap[tenAfter] || 0);
    } else {
      num = numMap[part] || 0;
    }
    return num.toString();
  });

  return result.join(" . ");
}
