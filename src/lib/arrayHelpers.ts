type ArrayItem = string | number | Record<string, unknown> | null | undefined;

export const extractStringValues = (
  items: ArrayItem[] | undefined
): string[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const values = Object.values(item);
        const value = values.find((v) => typeof v === "string") ?? values[0];
        return typeof value === "string" ? value : String(value ?? "");
      }
      return "";
    })
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
};

export const extractIds = (items: ArrayItem[] | undefined): number[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "number") return item;
      if (typeof item === "string" && item !== "") {
        const num = Number(item);
        return Number.isNaN(num) ? null : num;
      }
      if (item && typeof item === "object") {
        if ("id" in item && item.id != null) return Number(item.id);
        const values = Object.values(item);
        const num = Number(values[0]);
        return Number.isNaN(num) ? null : num;
      }
      return null;
    })
    .filter((id): id is number => id != null && !Number.isNaN(id));
};
