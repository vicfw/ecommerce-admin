import { extractStringValues } from "../../lib/arrayHelpers";

export const transformColorImageData = (data: Record<string, any>) => {
  return {
    name: data.name || "",
    colorImage: data.colorImage || "",
    images: extractStringValues(data.images),
    productId: data.productId ? Number(data.productId) : null,
  };
};
