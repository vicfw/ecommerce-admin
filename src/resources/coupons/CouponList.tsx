import {
  BooleanField,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  List,
  NumberField,
  TextField,
} from "react-admin";

export const CouponList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="code" />
        <TextField source="type" />
        <NumberField source="value" />
        <NumberField source="minCart" />
        <NumberField source="usedCount" />
        <NumberField source="maxUses" />
        <BooleanField source="active" />
        <DateField source="expiresAt" showTime />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
