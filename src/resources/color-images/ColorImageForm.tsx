import {
  ArrayInput,
  ReferenceInput,
  required,
  AutocompleteInput,
  SimpleFormIterator,
  TextInput,
} from "react-admin";
import Box from "@mui/material/Box";

export const ColorImageForm = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
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
            source="colorImage"
            label="Swatch Image URL"
            fullWidth
            validate={required()}
            helperText="URL for the color swatch thumbnail"
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <ReferenceInput source="productId" reference="product" perPage={50}>
          <AutocompleteInput
            optionText="enName"
            label="Product (optional)"
            fullWidth
          />
        </ReferenceInput>
      </Box>

      <Box sx={{ width: "100%" }}>
        <ArrayInput
          source="images"
          label="Product Images for this Color"
          validate={required()}
        >
          <SimpleFormIterator inline>
            <TextInput
              source=""
              label="Image URL"
              fullWidth
              validate={required()}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </Box>
    </Box>
  );
};
