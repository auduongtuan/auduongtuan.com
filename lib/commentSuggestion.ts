import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export type CommentSuggestion = {
  vietnamese: string[][];
  english: string[][];
};

export async function getCommentSuggestion(
  url: string,
): Promise<CommentSuggestion> {
  const prompt = `
    Read this article and give me 3 sets of comments in Vietnamese and English, each set containing 7 suggested comments like the way Facebook does. 
    Try to write them concisely, omitting redundant words, and limiting them to 10 words.
    Ensure the comments are specific and relevant to the content of the article.
    Give a raise or feedback to the article. 
    You can do web search to get more information about the article also. Or view links in the article to get more information about the topic in the article.
    Write with a fun, friendly voice, and add different emojis to each comment.
    Include two slightly negative comments, but keep them lighthearted.
    For Vietnamese, use trendy words like "keo," "đỉnh kao," "xịn" for positive comments and "xu cà na" for negative ones—but sparingly.
    For English, mix in trendy slang like "slay" or "stan" occasionally.
    These words are just example, you should try to use trendy words that are currently popular and match the content of the article.
    One comment should contain only one trendy word.
    Return in JSON format, structured as follows:
    {
      vietnamese: [["comment 1", "comment 2"], ["comment 3", "comment 4"]],
      english: [["comment 1", "comment 2"], ["comment 3", "comment 4"]]
    }
    ${url}
  `;
  let result: GenerateContentResponse;
  try {
    result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
  } catch (error) {
    result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
  }
  return result.text
    ? JSON.parse(result.text)
    : {
        vietnamese: [],
        english: [],
      };
}

// Cache helper functions
import { getMetadata, setMetadata } from "@lib/notion/metadata";

// Helper function to check if cache is fresh (within 1 month)
function isCacheFresh(lastEditedTime: string): boolean {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return new Date(lastEditedTime) > oneMonthAgo;
}

// Get cached comment suggestions for a page
export async function getCommentSuggestionsCache(page: string): Promise<{
  commentSuggestions: CommentSuggestion;
  lastEditedTime: string;
  isFresh: boolean;
} | null> {
  const metadata = await getMetadata("comment-suggestions", page);

  console.log("Cache metadata for page", page, metadata);

  if (!metadata || !metadata.value) {
    return null;
  }

  try {
    return {
      commentSuggestions: JSON.parse(metadata.value) as CommentSuggestion,
      lastEditedTime: metadata.lastEditedTime,
      isFresh: isCacheFresh(metadata.lastEditedTime),
    };
  } catch (error) {
    console.error("Failed to parse cached comment suggestions:", error);
    return null;
  }
}

// Set cached comment suggestions for a page
export async function setCommentSuggestionsCache(
  page: string,
  suggestions: CommentSuggestion,
): Promise<void> {
  await setMetadata("comment-suggestions", JSON.stringify(suggestions), page);
}
