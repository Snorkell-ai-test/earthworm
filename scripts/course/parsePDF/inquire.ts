import fs from "fs";
import inquirer from "inquirer";

/**
 * Asynchronously prompts the user to select an action and returns a Promise with the selected file paths.
 * @param folderPath The path of the folder to be used for file operations.
 * @returns A Promise that resolves with an array of selected file paths.
 * @throws {Error} If there is an error in the asynchronous operation.
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
 * Lists all files in the specified folder path.
 * @param {string} folderPath - The path of the folder to list files from.
 * @throws {Error} Throws an error if the folderPath is invalid or inaccessible.
 * @returns {Array<{name: string, value: string}>} An array of objects containing the name and value of each file in the folder.
 */
function listAllFiles(folderPath) {
  const files = fs.readdirSync(folderPath);
  return files.map((file, index) => ({
    name: `${index + 1}. ${file}`,
    value: `${folderPath}/${file}`,
  }));
}
