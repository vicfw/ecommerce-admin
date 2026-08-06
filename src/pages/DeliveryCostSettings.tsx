import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useCallback, useEffect, useState } from "react";
import { Title, useNotify } from "react-admin";
import {
  createDeliveryCost,
  getAllDeliveryCosts,
  getLatestDeliveryCost,
  type DeliveryCost,
} from "../api/admin";

export const DeliveryCostSettings = () => {
  const notify = useNotify();
  const [currentCost, setCurrentCost] = useState<DeliveryCost | null>(null);
  const [history, setHistory] = useState<DeliveryCost[]>([]);
  const [newCost, setNewCost] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [latest, all] = await Promise.all([
        getLatestDeliveryCost(),
        getAllDeliveryCosts(),
      ]);
      setCurrentCost(latest ?? null);
      setHistory(all ?? []);
    } catch {
      notify("Failed to load delivery cost settings", { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    const cost = parseFloat(newCost);
    if (isNaN(cost) || cost < 0) {
      notify("Please enter a valid cost", { type: "warning" });
      return;
    }

    setSaving(true);
    try {
      await createDeliveryCost(cost);
      notify("Delivery cost updated", { type: "success" });
      setNewCost("");
      await loadData();
    } catch {
      notify("Failed to update delivery cost", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Title title="Delivery Cost" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 720,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Delivery Cost Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set the shipping cost applied to customer orders.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current delivery cost
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            {loading
              ? "..."
              : currentCost
                ? `${currentCost.cost.toLocaleString()}`
                : "Not set"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-end",
            }}
          >
            <TextField
              label="New delivery cost"
              type="number"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              size="small"
              sx={{ width: { xs: "100%", sm: 240 } }}
            />
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !newCost}
            >
              {saving ? "Saving..." : "Update Cost"}
            </Button>
          </Box>
        </Box>

        {history.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              History
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cost</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.cost.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};
