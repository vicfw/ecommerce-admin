import Box from "@mui/material/Box";
import {
  BooleanInput,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
} from "react-admin";

type CategoryFormProps = {
  mode?: "create" | "edit";
};

export const CategoryForm = ({ mode = "create" }: CategoryFormProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ width: "100%" }}>
        {mode === "create" ? (
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
          />
        ) : (
          <NumberInput source="level" label="Category Level" disabled fullWidth />
        )}
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
          const currentLevel = formData?.level || 1;

          return (
            <>
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

              {(currentLevel === 2 || currentLevel === 3) && (
                <>
                  {mode === "create" && (
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
                  )}
                  {mode === "edit" && (
                    <Box sx={{ width: "100%" }}>
                      <ReferenceInput
                        source="parentId"
                        reference="category"
                      >
                        <SelectInput
                          optionText="name"
                          label="Parent Category"
                          fullWidth
                        />
                      </ReferenceInput>
                    </Box>
                  )}
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

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <BooleanInput source="isActive" label="Active" fullWidth />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput source="sortOrder" label="Sort Order" min={0} fullWidth />
        </Box>
      </Box>
    </Box>
  );
};
