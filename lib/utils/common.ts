export const get = (
  obj: Record<string, any>,
  path: string,
  defaultValue: any = undefined,
): any => {
  const travel = (regexp: RegExp): any =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res: any, key: string) =>
          res !== null && res !== undefined ? res[key] : res,
        obj,
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\.]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export function shuffleArray<T>(array: T[]) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
