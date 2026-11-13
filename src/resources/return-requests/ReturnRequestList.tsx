import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  SelectInput,
  TextField,
  useNotify,
  useRefresh,
  useUpdate,
} from "react-admin";

type ReturnRequestRecord = {
  id: number;
  orderId?: number;
  reason?: string;
  status?: string;
  user?: {
    name?: string;
    lastName?: string;
    phoneNumber?: string;
  };
};

const StatusActions = ({ record }: { record?: ReturnRequestRecord }) => {
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record || record.status !== "pending") return null;

  const resolve = async (status: "approved" | "rejected") => {
    try {
      await update(
        "return-request",
        {
          id: record.id,
          data: { status },
          previousData: record,
        },
        { returnPromise: true }
      );
      notify(
        status === "approved" ? "Return approved" : "Return rejected",
        { type: "success" }
      );
      refresh();
    } catch {
      notify("Failed to update return request", { type: "error" });
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="success"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          void resolve("approved");
        }}
      >
        Approve
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        disabled={isPending}
        sx={{ ml: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          void resolve("rejected");
        }}
      >
        Reject
      </Button>
    </>
  );
};

const filters = [
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: "pending", name: "Pending" },
      { id: "approved", name: "Approved" },
      { id: "rejected", name: "Rejected" },
    ]}
    alwaysOn
  />,
];

export const ReturnRequestList = () => {
  return (
    <List
      filters={filters}
      filterDefaultValues={{ status: "pending" }}
      sort={{ field: "createdAt", order: "DESC" }}
      title="Return Requests"
    >
      <Datagrid rowClick={false} bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="orderId" label="Order" />
        <FunctionField
          label="Customer"
          render={(record: ReturnRequestRecord) =>
            [record.user?.name, record.user?.lastName]
              .filter(Boolean)
              .join(" ") ||
            record.user?.phoneNumber ||
            "-"
          }
        />
        <FunctionField
          label="Reason"
          render={(record: ReturnRequestRecord) =>
            record.reason && record.reason.length > 80
              ? `${record.reason.slice(0, 80)}...`
              : record.reason || "-"
          }
        />
        <FunctionField
          label="Status"
          render={(record: ReturnRequestRecord) => (
            <Chip
              label={record.status || "-"}
              color={
                record.status === "approved"
                  ? "success"
                  : record.status === "rejected"
                    ? "error"
                    : "warning"
              }
              size="small"
            />
          )}
        />
        <DateField source="createdAt" label="Date" showTime />
        <FunctionField
          label="Actions"
          render={(record: ReturnRequestRecord) => (
            <StatusActions record={record} />
          )}
        />
      </Datagrid>
    </List>
  );
};
