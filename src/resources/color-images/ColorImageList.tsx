import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  ReferenceField,
} from "react-admin";
import { SwatchField } from "../../components/SwatchOption";

export const ColorImageList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <SwatchField
          imageSource="colorImage"
          labelSource="name"
          label="Swatch"
        />
        <TextField source="name" />
        <ReferenceField
          source="productId"
          reference="product"
          label="Product"
          emptyText="Unassigned"
        >
          <TextField source="enName" />
        </ReferenceField>
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
