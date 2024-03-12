import fs from "fs";
import inquirer from "inquirer";

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
export async function inquire(folderPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "action",
          message: "请选择操作：",
          choices: ["生成所有文件路径", "手动选取文件"],
        },
      ])
      .then((answers) => {
        if (answers.action === "生成所有文件路径") {
          const allFiles = listAllFiles(folderPath);
          const result = allFiles.forEach((file) => console.log(file));
          resolve(result);
        } else if (answers.action === "手动选取文件") {
          const files = listAllFiles(folderPath);
          inquirer
            .prompt([
              {
                type: "checkbox",
                name: "selectedFiles",
                message: "请选择要操作的文件：",
                choices: files,
              },
            ])
            .then((selected) => {
              const result = selected.selectedFiles.map((file) => file);
              resolve(result);
            });
        }
      });
  });
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
function listAllFiles(folderPath) {
  const files = fs.readdirSync(folderPath);
  return files.map((file, index) => ({
    name: `${index + 1}. ${file}`,
    value: `${folderPath}/${file}`,
  }));
}
