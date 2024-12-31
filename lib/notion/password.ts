import { notion } from "./base";
import { getProperty } from "./helpers";

export interface Password {
  id: string;
  value: string;
  hint: string;
}

export interface PasswordInfo {
  hint: string;
  length: number;
}

export async function getPassword(id: string): Promise<Password> {
  const response = await notion.pages.retrieve({
    page_id: id,
  });
  const value = getProperty(response, "Value", "title");
  const hint = getProperty(response, "Hint", "rich_text");
  return {
    id,
    value,
    hint,
  };
}
