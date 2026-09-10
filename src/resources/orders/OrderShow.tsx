import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import {
  Show,
  SelectInput,
  SaveButton,
  SimpleForm,
  Toolbar,
  useRecordContext,
  useUpdate,
  useNotify,
  useRefresh,
} from "react-admin";
import { ORDER_STATUS_CHOICES } from "../../lib/orderStatus";
import { parseOrderItems } from "../../lib/orderItems";

const OrderStatusForm = () => {
  const record = useRecordContext<{ id: number; status?: string }>();
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  return (
    <SimpleForm
      record={record}
      toolbar={
        <Toolbar>
          <SaveButton label="Update Status" disabled={isPending} />
        </Toolbar>
      }
      onSubmit={async (data: Record<string, unknown>) => {
        try {
          await update("order", {
            id: record.id,
            data: { status: data.status as string },
            previousData: record,
          });
          notify("Order status updated", { type: "success" });
          refresh();
        } catch {
          notify("Failed to update order status", { type: "error" });
        }
      }}
    >
      <SelectInput source="status" choices={ORDER_STATUS_CHOICES} fullWidth />
    </SimpleForm>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

const OrderItemsTable = () => {
  const record = useRecordContext<{ orderItem?: unknown }>();
  const items = parseOrderItems(record?.orderItem);

  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No items
      </Typography>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell align="right">Qty</TableCell>
          <TableCell align="right">Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              {item.product?.prName || item.product?.enName || "-"}
            </TableCell>
            <TableCell align="right">{item.quantity}</TableCell>
            <TableCell align="right">
              {item.itemPrice?.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const OrderDetails = () => {
  const record = useRecordContext<{
    id?: number;
    status?: string;
    inventoryStatus?: string;
    totalAmount?: number;
    deliveryAmount?: number;
    profitFromDiscount?: number;
    createdAt?: string;
    user?: {
      name?: string;
      lastName?: string;
      phoneNumber?: string;
      point?: number;
    };
    address?: {
      receiverName?: string;
      receiverLastName?: string;
      receiverPhoneNumber?: string;
      province?: string;
      city?: string;
      street?: string;
      address?: string;
    };
  }>();

  if (!record) return null;

  const customerName =
    [record.user?.name, record.user?.lastName].filter(Boolean).join(" ") || "-";
  const receiverName =
    [record.address?.receiverName, record.address?.receiverLastName]
      .filter(Boolean)
      .join(" ") || "-";
  const fullAddress = record.address
    ? [record.address.province, record.address.city, record.address.street, record.address.address]
        .filter(Boolean)
        .join(", ")
    : "-";

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Order Summary
          </Typography>
          <DetailRow label="Order ID" value={record.id} />
          <DetailRow
            label="Status"
            value={<Chip label={record.status} size="small" />}
          />
          <DetailRow
            label="Inventory"
            value={record.inventoryStatus || "-"}
          />
          <DetailRow
            label="Total Amount"
            value={record.totalAmount?.toLocaleString() ?? "-"}
          />
          <DetailRow
            label="Delivery Amount"
            value={record.deliveryAmount?.toLocaleString() ?? "-"}
          />
          <DetailRow
            label="Profit from Discount"
            value={record.profitFromDiscount?.toLocaleString() ?? "-"}
          />
          <DetailRow
            label="Created"
            value={
              record.createdAt
                ? new Date(record.createdAt).toLocaleString()
                : "-"
            }
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Update Status
          </Typography>
          <OrderStatusForm />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Customer
          </Typography>
          <DetailRow label="Name" value={customerName} />
          <DetailRow label="Phone" value={record.user?.phoneNumber || "-"} />
          <DetailRow label="Points" value={record.user?.point ?? "-"} />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shipping Address
          </Typography>
          <DetailRow label="Receiver" value={receiverName} />
          <DetailRow
            label="Phone"
            value={record.address?.receiverPhoneNumber || "-"}
          />
          <DetailRow label="Address" value={fullAddress} />
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Line Items
        </Typography>
        <OrderItemsTable />
      </Box>
    </Box>
  );
};

export const OrderShow = () => {
  return (
    <Show>
      <OrderDetails />
    </Show>
  );
};
