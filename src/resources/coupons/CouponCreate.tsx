import { Create, SimpleForm } from "react-admin";
import { CouponForm } from "./CouponForm";

export const CouponCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <CouponForm />
      </SimpleForm>
    </Create>
  );
};
