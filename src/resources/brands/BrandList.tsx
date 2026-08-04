import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
} from "react-admin";

export const BrandList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="name" label="Name" />
        <TextField source="engName" label="English Name" />
        <TextField source="slug" label="Slug" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
