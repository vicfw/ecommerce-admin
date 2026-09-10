import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Title, useNotify } from "react-admin";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, type DashboardStats } from "../api/admin";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      flex: 1,
      minWidth: 160,
    }}
  >
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 800 }}>
      {value}
    </Typography>
  </Box>
);

export const Dashboard = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => notify("Failed to load dashboard", { type: "error" }))
      .finally(() => setLoading(false));
  }, [notify]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Title title="Dashboard" />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Title title="Dashboard" />
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Title title="Dashboard" />

      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue.toLocaleString()}
        />
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Pending Reviews" value={stats.pendingComments} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Orders by Status
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <Chip key={status} label={`${status}: ${count}`} size="small" />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Low Stock Products
        </Typography>
        {stats.lowStockProducts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            All products are well stocked
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Reserved</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.prName}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">
                    {product.reservedQuantity ?? 0}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Recent Orders
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {[order.user?.name, order.user?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                    order.user?.phoneNumber ||
                    "-"}
                </TableCell>
                <TableCell>
                  <Chip label={order.status} size="small" />
                </TableCell>
                <TableCell align="right">
                  {order.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => navigate(`/order/${order.id}/show`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};
