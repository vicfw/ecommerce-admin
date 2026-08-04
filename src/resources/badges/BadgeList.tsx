import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
} from "react-admin";
import { SwatchField } from "../../components/SwatchOption";

export const BadgeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <SwatchField
          imageSource="icon"
          labelSource="title"
          label="Icon"
        />
        <TextField source="title" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
