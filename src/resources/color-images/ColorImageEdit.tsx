import { Edit, SimpleForm } from "react-admin";
import { ColorImageForm } from "./ColorImageForm";
import { transformColorImageData } from "./colorImageTransform";

export const ColorImageEdit = () => {
  return (
    <Edit
      transform={transformColorImageData}
      mutationMode="pessimistic"
      redirect="list"
    >
      <SimpleForm>
        <ColorImageForm />
      </SimpleForm>
    </Edit>
  );
};
