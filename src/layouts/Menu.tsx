import { Menu as RaMenu } from "react-admin";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import PaletteIcon from "@mui/icons-material/Palette";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const sectionHeaderSx = {
  px: 2.5,
  pb: 1,
  pt: 1.5,
  color: "text.secondary",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  lineHeight: 1.2,
};

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
    <RaMenu>
      <ListSubheader sx={sectionHeaderSx}>Catalog</ListSubheader>
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

      <ListSubheader sx={sectionHeaderSx}>Sales</ListSubheader>
      <RaMenu.Item
        to="/"
        primaryText="Dashboard"
        leftIcon={<DashboardIcon />}
      />
      <RaMenu.Item
        to="/order"
        primaryText="Orders"
        leftIcon={<ShoppingCartIcon />}
      />

      <ListSubheader sx={sectionHeaderSx}>Customers</ListSubheader>
      <RaMenu.Item
        to="/users"
        primaryText="Users"
        leftIcon={<PeopleIcon />}
      />
      <RaMenu.Item
        to="/comment"
        primaryText="Reviews"
        leftIcon={<RateReviewIcon />}
      />

      <ListSubheader sx={sectionHeaderSx}>Settings</ListSubheader>
      <RaMenu.Item
        to="/delivery-cost"
        primaryText="Delivery Cost"
        leftIcon={<LocalShippingIcon />}
      />
    </RaMenu>
  </Box>
);
