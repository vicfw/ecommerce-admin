type ColorSwatchProps = {
  src?: string | null;
  alt?: string;
  size?: number;
};

export const ColorSwatch = ({
  src,
  alt = "Color",
  size = 24,
}: ColorSwatchProps) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      style={{
        height: size,
        width: size,
        objectFit: "cover",
        borderRadius: "50%",
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        flexShrink: 0,
      }}
    />
  );
};
