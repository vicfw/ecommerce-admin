import { Menu as RaMenu } from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import PaletteIcon from "@mui/icons-material/Palette";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export const Menu = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      pt: 1,
      pb: 2,
    }}
  >
    <Typography
      variant="caption"
      sx={{
        px: 2.5,
        pb: 1,
        pt: 0.5,
        color: "text.secondary",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      Catalog
    </Typography>
    <RaMenu>
      <RaMenu.Item
        to="/category"
        primaryText="Categories"
        leftIcon={<CategoryIcon />}
      />
      <RaMenu.Item
        to="/product"
        primaryText="Products"
        leftIcon={<InventoryIcon />}
      />
      <RaMenu.Item
        to="/brand"
        primaryText="Brands"
        leftIcon={<BrandingWatermarkIcon />}
      />
      <RaMenu.Item
        to="/colorImage"
        primaryText="Color Images"
        leftIcon={<PaletteIcon />}
      />
      <RaMenu.Item
        to="/badge"
        primaryText="Badges"
        leftIcon={<LocalOfferIcon />}
      />
    </RaMenu>
  </Box>
);
