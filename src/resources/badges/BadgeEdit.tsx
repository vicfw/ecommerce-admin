import { Edit, SimpleForm } from "react-admin";
import { BadgeForm } from "./BadgeForm";

export const BadgeEdit = () => {
  return (
    <Edit mutationMode="pessimistic" redirect="list">
      <SimpleForm>
        <BadgeForm />
      </SimpleForm>
    </Edit>
  );
};
