import React from "react";
import { Box, Typography } from "@mui/material";
const CustomPageHeader = ({ heading ,backgroundColor}) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: backgroundColor || "#1976d2",
        borderRadius: 1,
        padding: "1% 2%",
        marginBottom:3
      }}
    >
      <Typography
        sx={{
          color: "#ffffff",
        }}
      >
        {heading}
      </Typography>
    </Box>
  );
};

export default CustomPageHeader;
