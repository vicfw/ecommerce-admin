import { Create, SimpleForm } from "react-admin";
import { ColorImageForm } from "./ColorImageForm";
import { transformColorImageData } from "./colorImageTransform";

export const ColorImageCreate = () => {
  return (
    <Create transform={transformColorImageData} redirect="list">
      <SimpleForm>
        <ColorImageForm />
      </SimpleForm>
    </Create>
  );
};
