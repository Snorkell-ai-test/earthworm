import path from "path";
import { inquire } from "./inquire";
import { parse } from "./parser";
import pdf from "pdf-parse";
import fs from "fs";

const targetPath = path.resolve(__dirname, "../pdf");
const outputPath = path.resolve(__dirname, "../courses");

(async function () {
  const pdfPaths = await inquire(targetPath);

  for (const pdfPath of pdfPaths) {
    let dataBuffer = fs.readFileSync(pdfPath);

    const rawPDFData = await pdf(dataBuffer);
    const result = parse(rawPDFData.text);

    const fileName = path.basename(pdfPath, ".pdf");

    save(JSON.stringify(result), fileName);
  }
})();

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
function save(content: string, fileName: string) {
  const filePath = path.resolve(outputPath, `${fileName}.json`);
  fs.writeFileSync(filePath, content);
}
