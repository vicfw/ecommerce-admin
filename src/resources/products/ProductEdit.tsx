import { Edit, SimpleForm, useRecordContext } from "react-admin";
import { ProductForm } from "./ProductForm";
import {
  normalizeProductRecord,
  transformProductData,
} from "./productTransform";

const ProductEditForm = () => {
  const record = useRecordContext();

  if (!record) return null;

  const formRecord = normalizeProductRecord(record);

  return (
    <SimpleForm record={formRecord}>
      <ProductForm />
    </SimpleForm>
  );
};

export const ProductEdit = () => {
  return (
    <Edit
      transform={transformProductData}
      mutationMode="pessimistic"
      redirect="list"
    >
      <ProductEditForm />
    </Edit>
  );
};
