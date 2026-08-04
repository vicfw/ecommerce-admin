import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  EditButton,
  DeleteButton,
  ReferenceField,
} from "react-admin";

export const CategoryList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="slug" />
        <NumberField source="level" label="Level" />
        <ReferenceField
          source="parentId"
          reference="category"
          label="Parent"
          emptyText="-"
        >
          <TextField source="name" />
        </ReferenceField>
        <BooleanField source="isActive" label="Active" />
        <NumberField source="sortOrder" label="Sort Order" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
