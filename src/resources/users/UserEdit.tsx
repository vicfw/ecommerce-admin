import Box from "@mui/material/Box";
import {
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const UserEdit = () => {
  return (
    <Edit mutationMode="pessimistic" redirect="list">
      <SimpleForm>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
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
              <TextInput source="phoneNumber" label="Phone" disabled fullWidth />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <TextInput source="name" label="Name" disabled fullWidth />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <TextInput
                source="lastName"
                label="Last Name"
                disabled
                fullWidth
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <TextInput
                source="createdAtdAt"
                label="Joined"
                disabled
                fullWidth
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <BooleanInput source="isAdmin" label="Admin" fullWidth />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <NumberInput source="point" label="Loyalty Points" min={0} fullWidth />
            </Box>
          </Box>
        </Box>
      </SimpleForm>
    </Edit>
  );
};
