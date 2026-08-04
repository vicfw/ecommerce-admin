import { required, TextInput } from "react-admin";
import Box from "@mui/material/Box";

export const BadgeForm = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
        <TextInput
          source="title"
          label="Title"
          fullWidth
          validate={required()}
        />
      </Box>
      <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
        <TextInput
          source="icon"
          label="Icon URL"
          fullWidth
          validate={required()}
          helperText="URL for the badge icon image"
        />
      </Box>
    </Box>
  );
};
