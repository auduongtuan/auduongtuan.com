import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export type CommentSuggestion = {
  vietnamese: string[][];
  english: string[][];
};

export async function getCommentSuggestion(
  url: string,
): Promise<CommentSuggestion> {
  let prompt = `
    Read this article and give me 3 sets of comments in Vietnamese and English, each set containing 7 suggested comments like the way Facebook does. 
    Try to write them concisely, omitting redundant words, and limiting them to 10 words.
    Ensure the comments are specific and relevant to the content of the article.
    Write with a fun, friendly voice, and add different emojis to each comment.
    Include two slightly negative comments, but keep them lighthearted.
    For Vietnamese, use trendy words like "tái châu," "keo," "đỉnh nóc," "xịn vậy má" for positive comments and "xu cà na" for negative ones—but sparingly.
    For English, mix in trendy slang like "slay" or "stan" occasionally.
    One comment should contain only one trendy word.
    Return in JSON format, structured as follows:
    {
      vietnamese: [["comment 1", "comment 2"], ["comment 3", "comment 4"]],
      english: [["comment 1", "comment 2"], ["comment 3", "comment 4"]]
    }
    ${url}
  `;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
