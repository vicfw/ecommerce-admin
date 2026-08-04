import { extractIds, extractStringValues } from "../../lib/arrayHelpers";

/** Coerce relation field to an array (API may return JSON string or objects) */
const toArray = (value: unknown) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/** Normalize API record (badges/colorImages as objects) into form-friendly shape */
export const normalizeProductRecord = (record: Record<string, any>) => {
  if (!record) return record;

  const badges = extractIds(toArray(record.badges));

  const colorSource =
    Array.isArray(record.colorImages) || typeof record.colorImages === "string"
      ? record.colorImages
      : record.colorImageIds;

  const colorImageIds = extractIds(toArray(colorSource));

  return {
    ...record,
    badges,
    colorImageIds,
  };
};

/** Format form data to match backend product API */
export const transformProductData = (data: Record<string, any>) => {
  const images = extractStringValues(data.images);
  const badges = extractIds(data.badges);
  const colorImageIds = extractIds(data.colorImageIds);

  return {
    prName: data.prName || "",
    enName: data.enName || "",
    price: Number(data.price) || 0,
    description: data.description || "",
    quantity: Number(data.quantity) || 0,
    images,
    // Always send array so clearing all badges on edit unlinks them
    badges,
    weight: data.weight ? Number(data.weight) : 0,
    discount: data.discount ? Number(data.discount) : 0,
    categoryId: Number(data.categoryId),
    brandId: data.brandId ? Number(data.brandId) : undefined,
    // Always send array so clearing all colors on edit unlinks them
    colorImageIds,
    defaultColorImage: data.defaultColorImage || images[0] || "",
  };
};
