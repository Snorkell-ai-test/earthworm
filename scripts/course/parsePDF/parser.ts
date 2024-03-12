
const STARTSIGN = "中文 英文 K.K.音标";
const ENDSIGN = "中文 原形 第三人称单数 过去式 ing形式";
/**
 * Parses the input text and extracts Chinese, English, and soundmark data.
 * 
 * @param text - The input text to be parsed.
 * @returns An array of objects containing Chinese, English, and soundmark data.
 * @throws {Error} If the input text is invalid or cannot be parsed.
 */
export function parse(text: string) {
  // 0. 先基于 \n 来切分成数组
  const rawTextList = text.split("\n").map((t) => {
    return t.trim();
  });

  // 1. 先获取到开始的点
  const startIndex = rawTextList.findIndex((t) => t === STARTSIGN);
  let endIndex = rawTextList.findIndex((t) => t.startsWith(ENDSIGN));
  if (endIndex === -1) {
    endIndex = rawTextList.length;
  }

  // 2. 过滤掉没有用的数据
  //    1. 空的
  //    2. 只有 number的（这个是换页符）
  const textList = rawTextList
    .slice(startIndex + 1, endIndex)
    // @ts-ignore
    .filter((t) => t && !/\d/.test(Number(t)));

  // 3. 成组 2个为一组  （中文 / 英文+音标）
  const result = [];

  for (let i = 0; i < textList.length; i++) {
    let data = {
      chinese: "",
      english: "",
      soundmark: "",
    };

    /**
     * Runs the function to process the text list and extract Chinese and English content.
     * @throws {Error} Throws an error if there is an issue with processing the text list.
     */
    function run() {
      const element = textList[i];
      let chinese = "";
      let englishAndSoundmark = "";

      if (isChinese(element)) {
        chinese += element;
        while (isChinese(textList[i + 1])) {
          chinese += "，" + textList[i + 1];
          i++;
        }

        data.chinese = parseChinese(chinese);
      } else {
        englishAndSoundmark += element;

        while (textList[i + 1] && !isChinese(textList[i + 1])) {
          englishAndSoundmark += " " + textList[i + 1];
          i++;
        }

        const { english, soundmark } =
          parseEnglishAndSoundmark(englishAndSoundmark);

        data.english = english;
        data.soundmark = soundmark;
      }
    }

    run();
    i++;
    run();

    result.push(data);
  }

  return result;
}

/**
 * Check if the input string contains Chinese characters.
 * @param str - The input string to be checked.
 * @returns - Returns true if the input string contains Chinese characters, otherwise returns false.
 * @throws - This function does not throw any exceptions.
 */
function isChinese(str: string) {
  const reg = /^[\u4e00-\u9fa5]/;
  return reg.test(str);
}

/**
 * Parses the input text to extract English and soundmark information.
 * 
 * @param text - The input text to be parsed.
 * @returns An object containing the parsed English and soundmark information.
 * @throws {Error} If the input text is empty or invalid.
 */
function parseEnglishAndSoundmark(text: string) {
  const list = text.split(" ");
  const soundmarkdStartIndex = list.findIndex((t) => t.startsWith("/"));

  const english = list
    .slice(0, soundmarkdStartIndex)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ")
    .trim();

  let rawSoundmark = list
    .slice(soundmarkdStartIndex)
    .join(" ")
    .split("/")
    .map((t) => {
      return t.trim().replace(/\s+/g, " ");
    })
    .filter((t) => {
      return t !== "";
    })
    .toString();

  const soundmark = `/${rawSoundmark.replace(/,/g, "/ /") + "/"}`;

  return {
    english,
    soundmark,
  };
}

/**
 * Parses the given Chinese string by removing commas.
 * 
 * @param chinese The Chinese string to be parsed
 * @returns The parsed Chinese string without commas
 * @throws {Error} If the input is not a valid string
 */
function parseChinese(chinese: string) {
  /**
   * Removes all occurrences of the comma character from the input string.
   * @param chinese The input string from which commas are to be removed.
   * @returns A new string with all commas removed.
   * @throws {Error} If the input is not a valid string.
   */
  function deleteComma(chinese: string) {
    return chinese.replace(/，/g, "");
  }

  return deleteComma(chinese);
}
