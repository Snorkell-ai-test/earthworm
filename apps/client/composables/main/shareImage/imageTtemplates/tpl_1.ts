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
// 通过 Satori 的在线调试工具 (https://og-playground.vercel.app/) 可以看到生成的图片效果
// 由于调试工具中，使用的是 jsx, 所以需要自己转换成以下格式（借助 GPT）会更方便转换
// 本模板使用了 tailwindcss，这是 Satori 的实验性功能

export const tpl_1 = ({
  zhSentence,
  enSentence,
  courseNum,
}: {
  courseNum: string;
  zhSentence: string;
  enSentence: string;
}) => {
  return {
    type: "div",
    props: {
      tw: "w-full h-full bg-[#EEA2A4] px-8 pt-8 flex flex-col items-center tracking-normal font-sans",
      children: [
        {
          type: "div",
          props: {
            tw: "bg-white rounded-xl flex-1 w-full flex flex-col px-2 py-4 mb-6 shadow-xl",
            children: [
              {
                type: "div",
                props: {
                  tw: "text-6xl font-bold flex",
                  children: '"',
                },
              },
              {
                type: "span",
                props: {
                  tw: "text-slate-400 font-bold text-2xl",
                  children: `Course ${courseNum}`,
                },
              },
              {
                type: "div",
                props: {
                  tw: "flex-1 flex flex-col font-bold text-slate-600 text-lg leading-snug italic font-serif text-2xl",
                  style: {
                    fontFamily: '"EBGaramond", "nzgrKangxi", serif',
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        tw: "mb-2",
                        children: enSentence,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        children: zhSentence,
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  tw: "text-6xl font-bold flex justify-end",
                  children: '"',
                },
              },
            ],
          },
        },
        {
          type: "img",
          props: {
            src: "/logo.png",
            width: "48",
            height: "48",
            alt: "Earthworm logo",
          },
        },
        {
          type: "p",
          props: {
            tw: "text-lg mb-2",
            children: "© earthworm.cuixueshe.com",
          },
        },
      ],
    },
  };
};
