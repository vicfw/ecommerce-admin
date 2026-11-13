import { Edit, SimpleForm } from "react-admin";
import { CouponForm } from "./CouponForm";

export const CouponEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <CouponForm />
      </SimpleForm>
    </Edit>
  );
};
