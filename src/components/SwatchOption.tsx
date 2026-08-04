import { useRecordContext, FunctionField } from "react-admin";
import Box from "@mui/material/Box";
import { ColorSwatch } from "./ColorSwatch";

type SwatchOptionProps = {
  imageField: string;
  labelField: string;
  fallbackAlt?: string;
};

/** Autocomplete option row: swatch image + label */
export const SwatchOption = ({
  imageField,
  labelField,
  fallbackAlt = "",
}: SwatchOptionProps) => {
  const record = useRecordContext<Record<string, string | undefined>>();
  if (!record) return null;

  const label = record[labelField];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ColorSwatch
        src={record[imageField]}
        alt={label || fallbackAlt}
        size={24}
      />
      <span>{label}</span>
    </Box>
  );
};

export const fieldInputText =
  (field: string) => (choice: Record<string, string | undefined> | null) =>
    choice?.[field] || "";

export const fieldMatchSuggestion =
  (field: string) =>
  (filter: string, choice: Record<string, string | undefined> | null) => {
    if (!filter) return true;
    return (choice?.[field] || "")
      .toLowerCase()
      .includes(filter.toLowerCase());
  };

type SwatchFieldProps = {
  imageSource: string;
  labelSource: string;
  label?: string;
  size?: number;
};

/** Datagrid column that renders a swatch (or "-") */
export const SwatchField = ({
  imageSource,
  labelSource,
  label = "Icon",
  size = 32,
}: SwatchFieldProps) => (
  <FunctionField
    label={label}
    render={(record: Record<string, string | undefined>) =>
      record?.[imageSource] ? (
        <ColorSwatch
          src={record[imageSource]}
          alt={record[labelSource] || label}
          size={size}
        />
      ) : (
        "-"
      )
    }
  />
);
