import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  EditButton,
  DateField,
} from "react-admin";

export const UserList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="phoneNumber" label="Phone" />
        <TextField source="name" />
        <TextField source="lastName" label="Last Name" />
        <NumberField source="point" label="Points" />
        <BooleanField source="isAdmin" label="Admin" />
        <DateField source="createdAtdAt" label="Joined" showTime />
        <EditButton />
      </Datagrid>
    </List>
  );
};
