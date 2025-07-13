/**
 * Safely formats a date, returns null if date is invalid
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric", 
    year: "numeric"
  }
): string | null {
  if (!date) return null;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  
  return dateObj.toLocaleDateString("en-US", options);
}

/**
 * Formats date for posts (Month Day, Year)
 */
export function formatPostDate(date: string | Date | null | undefined): string | null {
  return formatDate(date, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/**
 * Formats date for projects (Year Month)
 */
export function formatProjectDate(date: string | Date | null | undefined): string | null {
  return formatDate(date, {
    year: "numeric",
    month: "long"
  });
}