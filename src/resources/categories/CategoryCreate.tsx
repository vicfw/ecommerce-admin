import {
  Create,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
  useRedirect,
} from "react-admin";
import {
  createChildCategory,
  createMainCategory,
  createSubChildCategory,
} from "../../api/category";
import type { CreateCategoryPayload } from "../../api/category/types";
import { CategoryForm } from "./CategoryForm";

const CategoryCreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

export const CategoryCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data: CreateCategoryPayload, level: number) => {
    try {
      if (level === 1) {
        await createMainCategory(data);
      } else if (level === 2) {
        await createChildCategory(data);
      } else if (level === 3) {
        await createSubChildCategory(data);
      } else {
        notify("Please select a valid category level", { type: "error" });
        return;
      }

      notify("Category created successfully", { type: "success" });
      redirect("list", "category");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error creating category";
      notify(message, { type: "error" });
      throw error;
    }
  };

  return (
    <Create>
      <SimpleForm
        onSubmit={(data: any) => handleSave(data, data.level)}
        toolbar={<CategoryCreateToolbar />}
      >
        <CategoryForm mode="create" />
      </SimpleForm>
    </Create>
  );
};
