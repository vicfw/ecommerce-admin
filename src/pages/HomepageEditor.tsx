import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ImageIcon from "@mui/icons-material/Image";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ComputerIcon from "@mui/icons-material/Computer";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Title, useDataProvider, useNotify } from "react-admin";
import {
  emptyHomepageLayout,
  getHomepageAdmin,
  normalizeHomepageLayout,
  updateHomepage,
  uploadImages,
  type HomepageBannerSection,
  type HomepageContentBlock,
  type HomepageLayout,
  type HomepageProductSliderSection,
  type HomepageRowSection,
  type HomepageSection,
} from "../api/admin";

type DeviceTab = "desktop" | "mobile";

type ProductOption = {
  id: number;
  enName: string;
  prName?: string;
};

type SectionUpdater = (prev: HomepageSection) => HomepageSection;
type BlockUpdater = (prev: HomepageContentBlock) => HomepageContentBlock;

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createBanner = (): HomepageBannerSection => ({
  id: newId(),
  type: "banner",
  imageUrl: "",
  href: "",
  alt: "",
});

const createSlider = (): HomepageProductSliderSection => ({
  id: newId(),
  type: "product_slider",
  title: "",
  productIds: [],
});

const createRow = (columnCount = 2): HomepageRowSection => ({
  id: newId(),
  type: "row",
  columns: Array.from({ length: columnCount }, () => createBanner()),
});

const mergeProductOptions = (
  current: ProductOption[],
  incoming: ProductOption[]
) => {
  const map = new Map<number, ProductOption>();
  for (const item of [...current, ...incoming]) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
};

const collectLayoutProductIds = (layout: HomepageLayout) =>
  Array.from(
    new Set(
      [...layout.desktop, ...layout.mobile].flatMap((section) => {
        if (section.type === "product_slider") return section.productIds;
        if (section.type === "row") {
          return section.columns.flatMap((column) =>
            column.type === "product_slider" ? column.productIds : []
          );
        }
        return [];
      })
    )
  );

const cloneSectionsWithNewIds = (
  sections: HomepageSection[]
): HomepageSection[] =>
  sections.map((section) => {
    if (section.type === "row") {
      return {
        ...section,
        id: newId(),
        columns: section.columns.map((column) => ({
          ...column,
          id: newId(),
        })),
      };
    }
    return { ...section, id: newId() };
  });

const sanitizeContentBlock = (
  block: HomepageContentBlock
): HomepageContentBlock => {
  if (block.type === "banner") {
    return {
      id: block.id,
      type: "banner",
      imageUrl: block.imageUrl.trim(),
      ...(block.href?.trim() ? { href: block.href.trim() } : {}),
      ...(block.alt?.trim() ? { alt: block.alt.trim() } : {}),
    };
  }

  return {
    id: block.id,
    type: "product_slider",
    title: block.title.trim(),
    productIds: block.productIds,
  };
};

const sanitizeSections = (sections: HomepageSection[]): HomepageSection[] =>
  sections.map((section) => {
    if (section.type === "row") {
      return {
        id: section.id,
        type: "row" as const,
        columns: section.columns.map(sanitizeContentBlock),
      };
    }
    return sanitizeContentBlock(section);
  });

const findFirstInvalidMessage = (
  sections: HomepageSection[],
  deviceLabel: string
): string | null => {
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const position = `${deviceLabel} #${i + 1}`;

    if (section.type === "row") {
      if (section.columns.length < 1 || section.columns.length > 4) {
        return `${position} (row): must have between 1 and 4 columns`;
      }
      for (let c = 0; c < section.columns.length; c += 1) {
        const column = section.columns[c];
        if (column.type === "banner" && !column.imageUrl.trim()) {
          return `${position} row column ${c + 1}: banner needs an image URL`;
        }
        if (column.type === "product_slider" && !column.title.trim()) {
          return `${position} row column ${c + 1}: product slider needs a title`;
        }
      }
      continue;
    }

    if (section.type === "banner" && !section.imageUrl.trim()) {
      return `${position} (banner): needs an image URL`;
    }
    if (section.type === "product_slider" && !section.title.trim()) {
      return `${position} (slider): needs a title`;
    }
  }
  return null;
};

type ContentBlockEditorProps = {
  block: HomepageContentBlock;
  onChange: (updater: BlockUpdater) => void;
  onProductsResolved: (products: ProductOption[]) => void;
  productOptions: ProductOption[];
  productLoading: boolean;
  onProductSearch: (query: string) => void;
  onUploadError: () => void;
  compact?: boolean;
  allowTypeSwitch?: boolean;
};

const ContentBlockEditor = ({
  block,
  onChange,
  onProductsResolved,
  productOptions,
  productLoading,
  onProductSearch,
  onUploadError,
  compact = false,
  allowTypeSwitch = false,
}: ContentBlockEditorProps) => {
  const [uploading, setUploading] = useState(false);

  const selectedProducts = useMemo(() => {
    if (block.type !== "product_slider") return [];
    return block.productIds.map(
      (id) =>
        productOptions.find((p) => p.id === id) ?? {
          id,
          enName: `Product #${id}`,
        }
    );
  }, [block, productOptions]);

  const autocompleteOptions = useMemo(
    () => mergeProductOptions(productOptions, selectedProducts),
    [productOptions, selectedProducts]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {allowTypeSwitch && (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={block.type}
          onChange={(_, value: HomepageContentBlock["type"] | null) => {
            if (!value || value === block.type) return;
            onChange((prev) =>
              value === "banner"
                ? { ...createBanner(), id: prev.id }
                : { ...createSlider(), id: prev.id }
            );
          }}
        >
          <ToggleButton value="banner">Banner</ToggleButton>
          <ToggleButton value="product_slider">Product slider</ToggleButton>
        </ToggleButtonGroup>
      )}

      {block.type === "banner" ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: compact ? 140 : 220 },
                height: compact ? 90 : 120,
                borderRadius: 1,
                border: "1px dashed",
                borderColor: "divider",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
              }}
            >
              {block.imageUrl ? (
                <Box
                  component="img"
                  src={block.imageUrl}
                  alt={block.alt || "Banner preview"}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No image
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: compact ? 160 : 220,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                component="label"
                disabled={uploading}
                size={compact ? "small" : "medium"}
              >
                {uploading ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    setUploading(true);
                    try {
                      const urls = await uploadImages([file]);
                      if (urls?.[0]) {
                        // Functional update so concurrent field edits are not wiped.
                        onChange((prev) =>
                          prev.type === "banner"
                            ? { ...prev, imageUrl: urls[0] }
                            : prev
                        );
                      }
                    } catch {
                      onUploadError();
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
              </Button>
              <TextField
                label="Image URL"
                value={block.imageUrl}
                onChange={(e) => {
                  const imageUrl = e.target.value;
                  onChange((prev) =>
                    prev.type === "banner" ? { ...prev, imageUrl } : prev
                  );
                }}
                fullWidth
                size="small"
                helperText="Upload or paste a Cloudinary URL"
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <TextField
                label="Link URL (optional)"
                value={block.href ?? ""}
                onChange={(e) => {
                  const href = e.target.value;
                  onChange((prev) =>
                    prev.type === "banner" ? { ...prev, href } : prev
                  );
                }}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <TextField
                label="Alt text (optional)"
                value={block.alt ?? ""}
                onChange={(e) => {
                  const alt = e.target.value;
                  onChange((prev) =>
                    prev.type === "banner" ? { ...prev, alt } : prev
                  );
                }}
                fullWidth
                size="small"
              />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <TextField
            label="Slider title"
            value={block.title}
            onChange={(e) => {
              const title = e.target.value;
              onChange((prev) =>
                prev.type === "product_slider" ? { ...prev, title } : prev
              );
            }}
            fullWidth
            size="small"
            required
          />

          <Autocomplete
            multiple
            options={autocompleteOptions}
            loading={productLoading}
            value={selectedProducts}
            filterSelectedOptions
            filterOptions={(options) => options}
            getOptionLabel={(option) =>
              option.enName || option.prName || `#${option.id}`
            }
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onInputChange={(_, value, reason) => {
              if (reason === "input") onProductSearch(value);
            }}
            onChange={(_, value) => {
              onProductsResolved(value);
              const productIds = value.map((p) => p.id);
              onChange((prev) =>
                prev.type === "product_slider"
                  ? { ...prev, productIds }
                  : prev
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Products"
                size="small"
                helperText="Search and pick products in display order"
              />
            )}
          />
        </>
      )}
    </Box>
  );
};

type SortableSectionProps = {
  section: HomepageSection;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updater: SectionUpdater) => void;
  onRemove: () => void;
  onProductsResolved: (products: ProductOption[]) => void;
  productOptions: ProductOption[];
  productLoading: boolean;
  onProductSearch: (query: string) => void;
  onUploadError: () => void;
};

const sectionLabel = (section: HomepageSection) => {
  if (section.type === "banner") return "Banner";
  if (section.type === "product_slider") {
    return section.title || "Product slider";
  }
  return `Row (${section.columns.length} columns)`;
};

const sectionChip = (section: HomepageSection) => {
  if (section.type === "banner") return "Banner";
  if (section.type === "product_slider") return "Slider";
  return "Row";
};

const SortableSection = ({
  section,
  expanded,
  onToggle,
  onChange,
  onRemove,
  onProductsResolved,
  productOptions,
  productLoading,
  onProductSearch,
  onUploadError,
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const setColumnCount = (count: number) => {
    onChange((prev) => {
      if (prev.type !== "row") return prev;
      const nextColumns = [...prev.columns];
      while (nextColumns.length < count) {
        nextColumns.push(createBanner());
      }
      while (nextColumns.length > count) {
        nextColumns.pop();
      }
      return { ...prev, columns: nextColumns };
    });
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        overflow: "hidden",
        borderRadius: 2,
        border: "1px solid",
        borderColor: isDragging ? "primary.main" : "divider",
        bgcolor: "background.paper",
        boxShadow: isDragging ? 2 : 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderBottom: expanded ? "1px solid" : "none",
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "action.hover"
              : "background.default",
        }}
      >
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          sx={{ cursor: "grab", color: "text.secondary" }}
        >
          <DragIndicatorIcon />
        </IconButton>

        {section.type === "banner" ? (
          <ImageIcon fontSize="small" sx={{ color: "text.secondary" }} />
        ) : section.type === "product_slider" ? (
          <ViewCarouselIcon fontSize="small" sx={{ color: "text.secondary" }} />
        ) : (
          <ViewWeekIcon fontSize="small" sx={{ color: "text.secondary" }} />
        )}

        <Typography sx={{ flex: 1, fontWeight: 600, color: "text.primary" }}>
          {sectionLabel(section)}
        </Typography>

        <Chip
          size="small"
          label={sectionChip(section)}
          variant="outlined"
          color="primary"
        />

        <IconButton
          size="small"
          onClick={onToggle}
          aria-label="Toggle section"
          sx={{ color: "text.secondary" }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={onRemove}
          aria-label="Remove section"
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {section.type === "row" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Columns (equal width)
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={section.columns.length}
                  onChange={(_, value: number | null) => {
                    if (value) setColumnCount(value);
                  }}
                >
                  {[2, 3, 4].map((count) => (
                    <ToggleButton key={count} value={count}>
                      {count}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {section.columns.map((column, index) => (
                  <Box
                    key={column.id}
                    sx={{
                      width: {
                        xs: "100%",
                        md: `calc(${100 / section.columns.length}% - ${
                          ((section.columns.length - 1) * 16) /
                          section.columns.length
                        }px)`,
                      },
                      p: 1.5,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.default",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Column {index + 1}
                    </Typography>
                    <ContentBlockEditor
                      block={column}
                      compact
                      allowTypeSwitch
                      onChange={(updater) => {
                        onChange((prev) => {
                          if (prev.type !== "row") return prev;
                          return {
                            ...prev,
                            columns: prev.columns.map((col, i) =>
                              i === index ? updater(col) : col
                            ),
                          };
                        });
                      }}
                      onProductsResolved={onProductsResolved}
                      productOptions={productOptions}
                      productLoading={productLoading}
                      onProductSearch={onProductSearch}
                      onUploadError={onUploadError}
                    />
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <ContentBlockEditor
              block={section}
              onChange={(updater) => {
                onChange((prev) =>
                  prev.type === "row" ? prev : updater(prev)
                );
              }}
              onProductsResolved={onProductsResolved}
              productOptions={productOptions}
              productLoading={productLoading}
              onProductSearch={onProductSearch}
              onUploadError={onUploadError}
            />
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export const HomepageEditor = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [layout, setLayout] = useState<HomepageLayout>(emptyHomepageLayout);
  const [deviceTab, setDeviceTab] = useState<DeviceTab>("desktop");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const deviceTabRef = useRef(deviceTab);
  deviceTabRef.current = deviceTab;

  const sections = layout[deviceTab];

  const loadProducts = useCallback(
    async (search = "", keepIds: number[] = []) => {
      setProductLoading(true);
      try {
        const result = await dataProvider.getList("product", {
          pagination: { page: 1, perPage: 50 },
          sort: { field: "id", order: "DESC" },
          filter: search ? { q: search } : {},
        });
        const mapped = (result.data as ProductOption[]).map((p) => ({
          id: Number(p.id),
          enName: p.enName,
          prName: p.prName,
        }));

        setProductOptions((prev) => {
          const kept = prev.filter((p) => keepIds.includes(p.id));
          return mergeProductOptions(kept, mapped);
        });
      } catch {
        notify("Failed to load products", { type: "error" });
      } finally {
        setProductLoading(false);
      }
    },
    [dataProvider, notify]
  );

  const hydrateSelectedProducts = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return;
      try {
        const result = await dataProvider.getMany("product", { ids });
        const mapped = (result.data as ProductOption[]).map((p) => ({
          id: Number(p.id),
          enName: p.enName,
          prName: p.prName,
        }));
        setProductOptions((prev) => mergeProductOptions(prev, mapped));
      } catch {
        // Labels fall back to Product #id
      }
    },
    [dataProvider]
  );

  const loadHomepage = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHomepageAdmin();
      const nextLayout = normalizeHomepageLayout(data.sections);
      setLayout(nextLayout);
      setExpandedIds(
        new Set([
          ...nextLayout.desktop.map((s) => s.id),
          ...nextLayout.mobile.map((s) => s.id),
        ])
      );
      setDirty(false);

      const selectedIds = collectLayoutProductIds(nextLayout);
      await hydrateSelectedProducts(selectedIds);
      await loadProducts("", selectedIds);
    } catch {
      notify("Failed to load homepage", { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [hydrateSelectedProducts, loadProducts, notify]);

  useEffect(() => {
    void loadHomepage();
  }, [loadHomepage]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const onProductSearch = (query: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      void loadProducts(
        query.trim(),
        collectLayoutProductIds(layoutRef.current)
      );
    }, 300);
  };

  const setDeviceSections = (
    updater: (prev: HomepageSection[]) => HomepageSection[]
  ) => {
    const tab = deviceTabRef.current;
    setLayout((prev) => ({
      ...prev,
      [tab]: updater(prev[tab]),
    }));
    setDirty(true);
  };

  const updateSection = (id: string, updater: SectionUpdater) => {
    setDeviceSections((prev) =>
      prev.map((s) => (s.id === id ? updater(s) : s))
    );
  };

  const removeSection = (id: string) => {
    setDeviceSections((prev) => prev.filter((s) => s.id !== id));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addSection = (section: HomepageSection) => {
    setDeviceSections((prev) => [...prev, section]);
    setExpandedIds((prev) => new Set(prev).add(section.id));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDeviceSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const copyDesktopToMobile = () => {
    const mobile = cloneSectionsWithNewIds(layoutRef.current.desktop);
    setLayout((prev) => ({
      ...prev,
      mobile,
    }));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const section of mobile) {
        next.add(section.id);
      }
      return next;
    });
    setDeviceTab("mobile");
    setDirty(true);
    notify("Copied desktop layout to mobile", { type: "info" });
  };

  const handleSave = async () => {
    const current = layoutRef.current;

    const desktopError = findFirstInvalidMessage(current.desktop, "Desktop");
    if (desktopError) {
      setDeviceTab("desktop");
      notify(desktopError, { type: "warning" });
      return;
    }

    const mobileError = findFirstInvalidMessage(current.mobile, "Mobile");
    if (mobileError) {
      setDeviceTab("mobile");
      notify(mobileError, { type: "warning" });
      return;
    }

    const payload: HomepageLayout = {
      desktop: sanitizeSections(current.desktop),
      mobile: sanitizeSections(current.mobile),
    };

    setSaving(true);
    try {
      const data = await updateHomepage(payload);
      setLayout(normalizeHomepageLayout(data.sections));
      setDirty(false);
      notify("Homepage saved", { type: "success" });
    } catch {
      notify("Failed to save homepage", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      <Title title="Homepage" />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Homepage builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build separate desktop and mobile layouts. Use rows for equal-width
            side-by-side banners or sliders.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => addSection(createBanner())}
            startIcon={<ImageIcon />}
          >
            Add banner
          </Button>
          <Button
            variant="outlined"
            onClick={() => addSection(createSlider())}
            startIcon={<ViewCarouselIcon />}
          >
            Add product slider
          </Button>
          <Button
            variant="outlined"
            onClick={() => addSection(createRow(2))}
            startIcon={<ViewWeekIcon />}
          >
            Add row
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 3,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={deviceTab}
          onChange={(_, value: DeviceTab) => setDeviceTab(value)}
        >
          <Tab
            value="desktop"
            label="Desktop"
            icon={<ComputerIcon />}
            iconPosition="start"
          />
          <Tab
            value="mobile"
            label="Mobile"
            icon={<SmartphoneIcon />}
            iconPosition="start"
          />
        </Tabs>

        {deviceTab === "mobile" && (
          <Button
            size="small"
            variant="text"
            startIcon={<ContentCopyIcon />}
            onClick={copyDesktopToMobile}
            disabled={layout.desktop.length === 0}
          >
            Copy desktop → mobile
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : sections.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {deviceTab === "mobile"
              ? "Mobile layout is empty. Add sections or copy from desktop so mobile visitors are not left with a blank homepage."
              : "No sections yet. Add a banner, product slider, or row to get started."}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={() => addSection(createBanner())}
            >
              Add banner
            </Button>
            <Button
              variant="outlined"
              onClick={() => addSection(createSlider())}
            >
              Add product slider
            </Button>
            <Button variant="outlined" onClick={() => addSection(createRow(2))}>
              Add row
            </Button>
            {deviceTab === "mobile" && layout.desktop.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copyDesktopToMobile}
              >
                Copy desktop → mobile
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  expanded={expandedIds.has(section.id)}
                  onToggle={() =>
                    setExpandedIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(section.id)) next.delete(section.id);
                      else next.add(section.id);
                      return next;
                    })
                  }
                  onChange={(updater) => updateSection(section.id, updater)}
                  onRemove={() => removeSection(section.id)}
                  onProductsResolved={(products) =>
                    setProductOptions((prev) =>
                      mergeProductOptions(prev, products)
                    )
                  }
                  productOptions={productOptions}
                  productLoading={productLoading}
                  onProductSearch={onProductSearch}
                  onUploadError={() =>
                    notify("Image upload failed", { type: "error" })
                  }
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      )}

      <Box
        sx={{
          position: "sticky",
          bottom: 16,
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          zIndex: 2,
          p: 1.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => void loadHomepage()}
          disabled={loading || saving}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSave()}
          disabled={loading || saving || !dirty}
        >
          {saving ? "Saving…" : "Save homepage"}
        </Button>
      </Box>
    </Box>
  );
};
