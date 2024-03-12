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
 * Saves the content to a file with the specified file name.
 * @param content The content to be saved to the file.
 * @param fileName The name of the file to save the content to.
 * @throws Throws an error if the file cannot be written.
 */
function save(content: string, fileName: string) {
  const filePath = path.resolve(outputPath, `${fileName}.json`);
  fs.writeFileSync(filePath, content);
}
