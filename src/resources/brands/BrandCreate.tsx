import { Create, SimpleForm } from "react-admin";
import { BrandForm } from "./BrandForm";

export const BrandCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <BrandForm />
      </SimpleForm>
    </Create>
  );
};
