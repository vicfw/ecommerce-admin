import { Edit, SimpleForm } from "react-admin";
import { CategoryForm } from "./CategoryForm";

export const CategoryEdit = () => {
  return (
    <Edit mutationMode="pessimistic" redirect="list">
      <SimpleForm>
        <CategoryForm mode="edit" />
      </SimpleForm>
    </Edit>
  );
};
