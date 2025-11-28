import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function Tracking() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Theo dõi xe
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          Chức năng theo dõi đang được phát triển...
        </Typography>
      </Paper>
    </Box>
  );
}