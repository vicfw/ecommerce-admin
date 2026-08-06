import Chip from "@mui/material/Chip";
import {
  List,
  Datagrid,
  NumberField,
  DateField,
  FunctionField,
  SelectInput,
} from "react-admin";
import {
  ORDER_STATUS_CHOICES,
  ORDER_STATUS_COLORS,
} from "../../lib/orderStatus";

const orderFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={ORDER_STATUS_CHOICES}
    alwaysOn
  />,
];

export const OrderList = () => {
  return (
    <List filters={orderFilters} sort={{ field: "createdAt", order: "DESC" }}>
      <Datagrid rowClick="show">
        <NumberField source="id" />
        <FunctionField
          label="Status"
          render={(record: { status?: string }) => (
            <Chip
              label={record.status || "unknown"}
              color={ORDER_STATUS_COLORS[record.status || ""] || "default"}
              size="small"
            />
          )}
        />
        <NumberField source="totalAmount" label="Total" />
        <NumberField source="deliveryAmount" label="Delivery" />
        <FunctionField
          label="Customer"
          render={(record: {
            user?: { name?: string; lastName?: string; phoneNumber?: string };
          }) => {
            const u = record.user;
            if (!u) return "-";
            const name = [u.name, u.lastName].filter(Boolean).join(" ");
            return name || u.phoneNumber || "-";
          }}
        />
        <DateField source="createdAt" label="Date" showTime />
      </Datagrid>
    </List>
  );
};
