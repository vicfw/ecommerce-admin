export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "returned",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_CHOICES = ORDER_STATUSES.map((status) => ({
  id: status,
  name: status.charAt(0).toUpperCase() + status.slice(1),
}));

export const ORDER_STATUS_COLORS: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  returned: "error",
  delivered: "success",
  cancelled: "default",
};
