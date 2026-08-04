import { Edit, SimpleForm } from "react-admin";
import { BrandForm } from "./BrandForm";

export const BrandEdit = () => {
  return (
    <Edit mutationMode="pessimistic" redirect="list">
      <SimpleForm>
        <BrandForm />
      </SimpleForm>
    </Edit>
  );
};
