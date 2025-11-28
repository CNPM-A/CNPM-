import React from "react"
import { Grid, Paper, Typography, Box } from "@mui/material"
import PeopleIcon from "@mui/icons-material/People"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import PersonIcon from "@mui/icons-material/Person"
import RouteIcon from "@mui/icons-material/Route"

const stats = [
  { title: "Tổng học sinh", value: "150", icon: <PeopleIcon />, color: "#22c55e" },
  { title: "Tổng tài xế", value: "12", icon: <PersonIcon />, color: "#f59e0b" },
  { title: "Tổng xe buýt", value: "8", icon: <DirectionsBusIcon />, color: "#6366f1" },
  { title: "Tổng tuyến đường", value: "5", icon: <RouteIcon />, color: "#ef4444" },
]

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: stat.color,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
