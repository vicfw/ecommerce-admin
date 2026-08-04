import { Create, SimpleForm } from "react-admin";
import { BadgeForm } from "./BadgeForm";

export const BadgeCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <BadgeForm />
      </SimpleForm>
    </Create>
  );
};
