import React, { useEffect, useState } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { AdminService } from "../api/services";

export default function Messages() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    AdminService.listMessages().then(setRows);
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Tin nhắn
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        {rows.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Thời gian</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.message_id} hover>
                  <TableCell>{r.message_id}</TableCell>
                  <TableCell>{r.message_text}</TableCell>
                  <TableCell>{new Date(r.sent_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary">Chức năng tin nhắn đang được phát triển...</Typography>
        )}
      </Paper>
    </Box>
  );
}
