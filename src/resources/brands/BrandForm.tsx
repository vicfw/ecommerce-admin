import { required, TextInput } from "react-admin";
import Box from "@mui/material/Box";

export const BrandForm = () => {
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
            source="engName"
            label="English Name"
            fullWidth
            validate={required()}
          />
        </Box>
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
  );
};
