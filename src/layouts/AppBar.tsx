import { AppBar as RaAppBar, TitlePortal } from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const AppBar = () => (
  <RaAppBar color="inherit" alwaysOn userMenu={false}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minWidth: 0,
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pr: 1.5,
          mr: 0.5,
          borderRight: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          E
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "text.primary",
            lineHeight: 1,
          }}
        >
          Ecommerce
        </Typography>
      </Box>
      <TitlePortal />
    </Box>
  </RaAppBar>
);
