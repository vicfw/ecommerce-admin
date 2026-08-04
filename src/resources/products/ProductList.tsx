import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  ReferenceField,
  FunctionField,
} from "react-admin";

export const ProductList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <FunctionField
          label="Image"
          render={(record: { images?: string[]; prName?: string }) =>
            record.images?.[0] ? (
              <img
                src={record.images[0]}
                alt={record.prName || "Product"}
                style={{
                  height: 44,
                  width: 44,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                }}
              />
            ) : (
              "-"
            )
          }
        />
        <TextField source="prName" label="Persian Name" />
        <TextField source="enName" label="English Name" />
        <ReferenceField
          source="categoryId"
          reference="category"
          label="Category"
        >
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="brandId" reference="brand" label="Brand">
          <TextField source="name" />
        </ReferenceField>
        <NumberField source="price" label="Price" />
        <NumberField source="discount" label="Discount" />
        <NumberField source="quantity" label="Quantity" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
