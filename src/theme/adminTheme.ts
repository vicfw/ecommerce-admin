import {
  alpha,
  createTheme,
  type PaletteOptions,
  type Theme,
  type ThemeOptions,
} from "@mui/material";

const fontFamily = [
  '"Plus Jakarta Sans"',
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "sans-serif",
].join(",");

const componentsOverrides = (theme: Theme): ThemeOptions["components"] => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      "*::-webkit-scrollbar": {
        width: 8,
        height: 8,
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: alpha(theme.palette.text.primary, 0.18),
        borderRadius: 8,
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
      color: "inherit",
    },
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundImage: "none",
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 8,
      },
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 12,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
      elevation1: {
        boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.04)}, 0 8px 24px ${alpha(theme.palette.common.black, 0.04)}`,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottomColor: theme.palette.divider,
        "&.MuiTableCell-paddingCheckbox": {
          padding: "0 8px",
        },
      },
      head: {
        fontWeight: 700,
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.text.primary, 0.02),
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:last-child td": {
          borderBottom: 0,
        },
        "&.MuiTableRow-hover:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined" as const,
      margin: "dense" as const,
      size: "small" as const,
      fullWidth: true,
    },
  },
  MuiFormControl: {
    defaultProps: {
      variant: "outlined" as const,
      margin: "dense" as const,
      size: "small" as const,
      fullWidth: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: "none",
      },
    },
  },
  RaAppBar: {
    styleOverrides: {
      root: {
        color: theme.palette.text.primary,
        "& .RaAppBar-toolbar": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          minHeight: 56,
          paddingInline: theme.spacing(1.5),
        },
      },
    },
  },
  RaSidebar: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
  RaMenuItemLink: {
    styleOverrides: {
      root: {
        margin: theme.spacing(0.25, 1),
        borderRadius: 8,
        paddingBlock: theme.spacing(1),
        color: theme.palette.text.secondary,
        transition: "background-color 120ms ease, color 120ms ease",
        "& .MuiListItemIcon-root": {
          color: "inherit",
          minWidth: 36,
        },
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          color: theme.palette.text.primary,
        },
        "&.RaMenuItemLink-active": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          fontWeight: 700,
          "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  },
  RaLayout: {
    styleOverrides: {
      root: {
        "& .RaLayout-content": {
          padding: theme.spacing(2.5),
          [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1.5),
          },
        },
        "& .RaLayout-appFrame": {
          marginTop: 56,
        },
      },
    },
  },
  RaList: {
    styleOverrides: {
      root: {
        "& .RaList-main": {
          gap: theme.spacing(1.5),
        },
        "& .RaList-content": {
          borderRadius: 12,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          boxShadow: "none",
        },
      },
    },
  },
  RaDatagrid: {
    styleOverrides: {
      root: {
        "& .RaDatagrid-headerCell": {
          fontWeight: 700,
        },
        "& .RaDatagrid-rowCell": {
          paddingTop: theme.spacing(1.25),
          paddingBottom: theme.spacing(1.25),
        },
      },
    },
  },
  RaToolbar: {
    styleOverrides: {
      root: {
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.04)
            : alpha(theme.palette.text.primary, 0.03),
        borderTop: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  RaCreate: {
    styleOverrides: {
      root: {
        "& .RaCreate-card": {
          borderRadius: 12,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        },
      },
    },
  },
  RaEdit: {
    styleOverrides: {
      root: {
        "& .RaEdit-card": {
          borderRadius: 12,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        },
      },
    },
  },
});

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#0F766E",
    light: "#14B8A6",
    dark: "#115E59",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#334155",
    light: "#64748B",
    dark: "#1E293B",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F1F5F9",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#0F172A",
    secondary: "#64748B",
  },
  divider: "#E2E8F0",
  error: { main: "#DC2626" },
  warning: { main: "#D97706" },
  info: { main: "#0284C7" },
  success: { main: "#059669" },
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#2DD4BF",
    light: "#5EEAD4",
    dark: "#14B8A6",
    contrastText: "#042F2E",
  },
  secondary: {
    main: "#94A3B8",
    light: "#CBD5E1",
    dark: "#64748B",
    contrastText: "#0F172A",
  },
  background: {
    default: "#0B1220",
    paper: "#111827",
  },
  text: {
    primary: "#E2E8F0",
    secondary: "#94A3B8",
  },
  divider: "#1F2937",
  error: { main: "#F87171" },
  warning: { main: "#FBBF24" },
  info: { main: "#38BDF8" },
  success: { main: "#34D399" },
};

const createAdminTheme = (palette: PaletteOptions) => {
  const theme = createTheme({
    palette,
    shape: { borderRadius: 10 },
    spacing: 8,
    sidebar: {
      width: 248,
      closedWidth: 56,
    },
    typography: {
      fontFamily,
      fontSize: 14,
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700, letterSpacing: "-0.01em" },
      button: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
    },
  });

  theme.components = componentsOverrides(theme) as Theme["components"];
  return theme;
};

export const adminLightTheme = createAdminTheme(lightPalette);
export const adminDarkTheme = createAdminTheme(darkPalette);
