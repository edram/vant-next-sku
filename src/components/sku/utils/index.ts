export function isEmpty(value: any): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value !== "object") {
    return true;
  }

  return Object.keys(value).length === 0;
}
