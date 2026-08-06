export const normalizeIsApprovedFilter = (
  filters: Record<string, unknown>
): Record<string, unknown> => {
  const result = { ...filters };
  const value = result.isApproved;

  if (value === false || value === "false") {
    result.isApproved = "false";
  } else if (value === true || value === "true") {
    result.isApproved = "true";
  }

  return result;
};
