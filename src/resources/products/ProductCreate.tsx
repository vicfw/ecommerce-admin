import { Create, SimpleForm } from "react-admin";
import { ProductForm } from "./ProductForm";
import { transformProductData } from "./productTransform";

export const ProductCreate = () => {
  return (
    <Create transform={transformProductData} redirect="list">
      <SimpleForm>
        <ProductForm />
      </SimpleForm>
    </Create>
  );
};
