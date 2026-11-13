import {
  BooleanInput,
  DateTimeInput,
  NumberInput,
  required,
  SelectInput,
  TextInput,
} from "react-admin";
import Box from "@mui/material/Box";

export const CouponForm = () => {
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
            source="code"
            label="Code"
            fullWidth
            validate={required()}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <SelectInput
            source="type"
            label="Type"
            fullWidth
            validate={required()}
            choices={[
              { id: "percent", name: "Percent" },
              { id: "fixed", name: "Fixed" },
            ]}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput
            source="value"
            label="Value"
            fullWidth
            validate={required()}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput source="minCart" label="Min cart" fullWidth />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <NumberInput source="maxUses" label="Max uses" fullWidth />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <DateTimeInput source="expiresAt" label="Expires at" fullWidth />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
          <BooleanInput source="active" label="Active" defaultValue={true} />
        </Box>
      </Box>
    </Box>
  );
};
