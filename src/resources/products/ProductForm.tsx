import {
  ArrayInput,
  AutocompleteArrayInput,
  AutocompleteInput,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  minValue,
  SimpleFormIterator,
  TextInput,
} from "react-admin";
import Box from "@mui/material/Box";
import {
  SwatchOption,
  fieldInputText,
  fieldMatchSuggestion,
} from "../../components/SwatchOption";

export const ProductForm = () => {
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
            source="prName"
            label="Persian Name"
            fullWidth
            validate={required()}
          />
        </Box>

        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <TextInput
            source="enName"
            label="English Name"
            fullWidth
            validate={required()}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <ReferenceInput source="categoryId" reference="category" perPage={50}>
            <AutocompleteInput
              optionText="name"
              label="Category"
              fullWidth
              validate={required()}
            />
          </ReferenceInput>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <ReferenceInput source="brandId" reference="brand" perPage={50}>
            <AutocompleteInput optionText="name" label="Brand" fullWidth />
          </ReferenceInput>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput
            source="price"
            label="Price"
            fullWidth
            validate={[required(), minValue(0)]}
            min={0}
            step={0.01}
          />
        </Box>

        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput
            source="discount"
            label="Discount"
            fullWidth
            validate={minValue(0)}
            min={0}
            step={0.01}
            defaultValue={0}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput
            source="quantity"
            label="Quantity"
            fullWidth
            validate={[required(), minValue(0)]}
            min={0}
          />
        </Box>

        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput
            source="weight"
            label="Weight"
            fullWidth
            validate={minValue(0)}
            min={0}
            step={0.01}
            defaultValue={0}
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <TextInput
          source="description"
          label="Description"
          fullWidth
          multiline
          rows={4}
          validate={required()}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <ArrayInput source="images" label="Images">
          <SimpleFormIterator inline>
            <TextInput
              source=""
              label="Image URL"
              helperText="Enter image URL"
              fullWidth
              validate={required()}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </Box>

      <Box sx={{ width: "100%" }}>
        <TextInput
          source="defaultColorImage"
          label="Default Color Image URL"
          helperText="Optional — defaults to the first product image"
          fullWidth
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <ReferenceArrayInput source="badges" reference="badge" perPage={50}>
          <AutocompleteArrayInput
            label="Badges"
            optionText={
              <SwatchOption
                imageField="icon"
                labelField="title"
                fallbackAlt="Badge"
              />
            }
            inputText={fieldInputText("title")}
            matchSuggestion={fieldMatchSuggestion("title")}
            fullWidth
          />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ width: "100%" }}>
        <ReferenceArrayInput
          source="colorImageIds"
          reference="colorImage"
          perPage={50}
        >
          <AutocompleteArrayInput
            label="Color Images"
            optionText={
              <SwatchOption
                imageField="colorImage"
                labelField="name"
                fallbackAlt="Color"
              />
            }
            inputText={fieldInputText("name")}
            matchSuggestion={fieldMatchSuggestion("name")}
            fullWidth
          />
        </ReferenceArrayInput>
      </Box>
    </Box>
  );
};
