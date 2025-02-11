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
