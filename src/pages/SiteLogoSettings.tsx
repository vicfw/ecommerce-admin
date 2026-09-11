import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import { Title, useNotify } from "react-admin";
import {
  getSiteSettingsAdmin,
  updateSiteSettings,
  uploadImages,
  type SiteSettings,
} from "../api/admin";

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";

export const SiteLogoSettings = () => {
  const notify = useNotify();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [siteName, setSiteName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoAlt, setLogoAlt] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteSettingsAdmin();
      setSettings(data);
      setSiteName(data.siteName ?? "");
      setLogoUrl(data.logoUrl ?? "");
      setLogoAlt(data.logoAlt ?? "");
      setFaviconUrl(data.faviconUrl ?? "");
    } catch {
      notify("Failed to load site logo settings", { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpload = async (
    file: File | undefined,
    kind: "logo" | "favicon"
  ) => {
    if (!file) return;

    const setUploading =
      kind === "logo" ? setUploadingLogo : setUploadingFavicon;
    setUploading(true);
    try {
      const urls = await uploadImages([file]);
      if (urls?.[0]) {
        if (kind === "logo") {
          setLogoUrl(urls[0]);
        } else {
          setFaviconUrl(urls[0]);
        }
        notify("Image uploaded", { type: "success" });
      }
    } catch {
      notify("Failed to upload image", { type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSiteSettings({
        siteName: siteName.trim(),
        logoUrl: logoUrl.trim() || null,
        logoAlt: logoAlt.trim() || null,
        faviconUrl: faviconUrl.trim() || null,
      });
      setSettings(updated);
      notify("Site logo settings saved", { type: "success" });
    } catch {
      notify("Failed to save site logo settings", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Title title="Site Logo" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 720,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Site Logo Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set the storefront logo, site name, and optional favicon. These are
            used in the header, auth pages, browser tab, and Google Organization
            markup.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Site name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
            helperText="Used as the default page title and logo alt fallback"
          />

          <TextField
            label="Logo alt text"
            value={logoAlt}
            onChange={(e) => setLogoAlt(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
            helperText="Leave empty to use the site name (never use “logo” alone)"
          />

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
                width: { xs: "100%", md: "calc(50% - 8px)" },
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Logo
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 120,
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover",
                  overflow: "hidden",
                  p: 1,
                }}
              >
                {logoUrl ? (
                  <Box
                    component="img"
                    src={logoUrl}
                    alt={logoAlt || siteName || "Logo preview"}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No logo
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                disabled={loading || uploadingLogo}
                size="small"
              >
                {uploadingLogo ? "Uploading…" : "Upload logo"}
                <input
                  type="file"
                  hidden
                  accept={IMAGE_ACCEPT}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    void handleUpload(file, "logo");
                  }}
                />
              </Button>
              <TextField
                label="Logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                fullWidth
                size="small"
                disabled={loading}
                helperText="PNG/SVG/WebP, min 112×112. Upload or paste a Cloudinary URL"
              />
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "calc(50% - 8px)" },
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Favicon (optional)
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 120,
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover",
                  overflow: "hidden",
                  p: 1,
                }}
              >
                {faviconUrl ? (
                  <Box
                    component="img"
                    src={faviconUrl}
                    alt="Favicon preview"
                    sx={{
                      width: 48,
                      height: 48,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Falls back to logo
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                disabled={loading || uploadingFavicon}
                size="small"
              >
                {uploadingFavicon ? "Uploading…" : "Upload favicon"}
                <input
                  type="file"
                  hidden
                  accept={IMAGE_ACCEPT}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    void handleUpload(file, "favicon");
                  }}
                />
              </Button>
              <TextField
                label="Favicon URL"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                fullWidth
                size="small"
                disabled={loading}
                helperText="Square PNG, min 48×48 (ideally 512×512)"
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || saving}
            >
              {saving ? "Saving…" : "Save settings"}
            </Button>
            {settings?.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(settings.updatedAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
