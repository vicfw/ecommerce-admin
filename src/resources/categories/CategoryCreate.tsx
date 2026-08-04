import Box from "@mui/material/Box";
import { useState } from "react";
import {
  BooleanInput,
  Create,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
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

const CategoryCreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

export const CategoryCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (data: CreateCategoryPayload, level: number) => {
    let response;
    try {
      if (level === 1) {
        response = createMainCategory(data);
      }
      if (level === 2) {
        response = createChildCategory(data);
      }
      if (level === 3) {
        response = createSubChildCategory(data);
      }

      notify("Category created successfully", { type: "success" });
      redirect("list", "category");

      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error creating category";
      notify(message, { type: "error" });
      throw error;
    }
  };

  return (
    <Create>
      <CategoryCreateForm onSave={handleSave} />
    </Create>
  );
};

interface CategoryCreateFormProps {
  onSave: (data: CreateCategoryPayload, level: number) => Promise<any>;
}

const CategoryCreateForm = ({ onSave }: CategoryCreateFormProps) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  return (
    <SimpleForm
      onSubmit={(data: any) => {
        onSave(data, data.level);
      }}
      toolbar={<CategoryCreateToolbar />}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <SelectInput
            source="level"
            label="Category Level"
            choices={[
              { id: 1, name: "Parent (Level 1)" },
              { id: 2, name: "Child (Level 2)" },
              { id: 3, name: "Subchild (Level 3)" },
            ]}
            defaultValue={1}
            validate={required()}
            fullWidth
            onChange={(e: any) => {
              setLevel(e.target.value || 1);
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
            <TextInput
              source="name"
              label="Name"
              fullWidth
              validate={required()}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
            <TextInput
              source="slug"
              label="Slug"
              fullWidth
              validate={required()}
            />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <TextInput
            source="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
          />
        </Box>

        <FormDataConsumer>
          {({ formData }) => {
            const currentLevel = formData?.level || level || 1;

            return (
              <>
                {/* Parent category fields (level 1) */}
                {currentLevel === 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                      <TextInput
                        source="parentImage"
                        label="Parent Image URL"
                        fullWidth
                      />
                    </Box>
                    <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                      <TextInput
                        source="parentBanner"
                        label="Parent Banner URL"
                        fullWidth
                      />
                    </Box>
                  </Box>
                )}

                {/* Child and Subchild fields (level 2 & 3) */}
                {(currentLevel === 2 || currentLevel === 3) && (
                  <>
                    <Box sx={{ width: "100%" }}>
                      <ReferenceInput
                        source="parentId"
                        reference="category"
                        filter={{ level: currentLevel === 2 ? 1 : 2 }}
                      >
                        <SelectInput
                          optionText="name"
                          label={
                            currentLevel === 2
                              ? "Parent Category"
                              : "Child Category"
                          }
                          fullWidth
                          validate={required()}
                        />
                      </ReferenceInput>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", md: "calc(33.333% - 11px)" },
                        }}
                      >
                        <TextInput source="image" label="Image URL" fullWidth />
                      </Box>
                      <Box
                        sx={{
                          width: { xs: "100%", md: "calc(33.333% - 11px)" },
                        }}
                      >
                        <TextInput source="color" label="Color" fullWidth />
                      </Box>
                      <Box
                        sx={{
                          width: { xs: "100%", md: "calc(33.333% - 11px)" },
                        }}
                      >
                        <TextInput source="icon" label="Icon URL" fullWidth />
                      </Box>
                    </Box>
                  </>
                )}
              </>
            );
          }}
        </FormDataConsumer>

        {/* Common fields */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
            <BooleanInput
              source="isActive"
              label="Active"
              defaultValue={true}
              fullWidth
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
            <NumberInput
              source="sortOrder"
              label="Sort Order"
              defaultValue={0}
              min={0}
              fullWidth
            />
          </Box>
        </Box>
      </Box>
    </SimpleForm>
  );
};
