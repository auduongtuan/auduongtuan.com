import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function getCommentSuggestion(
  url: string,
  language: string = "vietnamese",
) {
  let prompt = `
    Read this article and give me 3 set, each set contains 7 suggested comments like the way Facebook does.\
    Try to write it as shortly, omit redudant words, limited by 10 words.\
    You must give specific comments that are relevant to the content of the article.\
    You must write with fun friendly voice in ${language}, and add emojis to the end of the comment, these emojis should be different. \
    Last 2 comments should be in negative attitude but they shouldn't be too harsh.\
    If language is vietnamese, you should use trendy words like "tái châu", "keo", "đỉnh nóc", "xịn vậy má" for positive comments and "xu cà na" in negative comments but not all.\
    If language is english, you should use trendy slang words like "slay", "stan" in some comments but not all.\ 
    One comment should contain only one trendy word.\
    Return in json format of comment string array like ['comment 1', 'comment 2'] for each set, all sets are in a single array like [['comment 1 of set 1', 'comment 2 of set 1'], ['comment 1 of set 2', 'comment 2 of set 2']] with no introduction in plain text string in UTF-8\n
    ${url}  
  `;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
