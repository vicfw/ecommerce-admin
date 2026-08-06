import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  DeleteButton,
  useUpdate,
  useNotify,
  SelectInput,
} from "react-admin";

const ApproveButton = ({
  record,
}: {
  record?: {
    id: number;
    isApproved?: boolean;
    body?: string;
    image?: string;
    productId?: number;
  };
}) => {
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();

  if (!record || record.isApproved) return null;

  return (
    <Button
      size="small"
      variant="outlined"
      color="success"
      disabled={isPending}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await update("comment", {
            id: record.id,
            data: { isApproved: true },
            previousData: record,
          });
          notify("Comment approved", { type: "success" });
        } catch {
          notify("Failed to approve comment", { type: "error" });
        }
      }}
    >
      Approve
    </Button>
  );
};

const commentFilters = [
  <SelectInput
    key="isApproved"
    source="isApproved"
    choices={[
      { id: false, name: "Pending" },
      { id: true, name: "Approved" },
    ]}
    alwaysOn
  />,
];

export const CommentList = () => {
  return (
    <List
      filters={commentFilters}
      filterDefaultValues={{ isApproved: false }}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick={false}>
        <TextField source="id" />
        <FunctionField
          label="Product"
          render={(record: {
            product?: { prName?: string; enName?: string };
          }) =>
            record.product?.prName || record.product?.enName || "-"
          }
        />
        <FunctionField
          label="User"
          render={(record: {
            user?: { name?: string; lastName?: string };
          }) =>
            [record.user?.name, record.user?.lastName]
              .filter(Boolean)
              .join(" ") || "-"
          }
        />
        <FunctionField
          label="Comment"
          render={(record: { body?: string }) =>
            record.body && record.body.length > 80
              ? `${record.body.slice(0, 80)}...`
              : record.body || "-"
          }
        />
        <FunctionField
          label="Image"
          render={(record: { image?: string }) =>
            record.image ? (
              <img
                src={record.image}
                alt="Review"
                style={{
                  height: 40,
                  width: 40,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              "-"
            )
          }
        />
        <FunctionField
          label="Status"
          render={(record: { isApproved?: boolean }) => (
            <Chip
              label={record.isApproved ? "Approved" : "Pending"}
              color={record.isApproved ? "success" : "warning"}
              size="small"
            />
          )}
        />
        <DateField source="createdAt" label="Date" showTime />
        <FunctionField
          label="Actions"
          render={(record) => <ApproveButton record={record} />}
        />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
