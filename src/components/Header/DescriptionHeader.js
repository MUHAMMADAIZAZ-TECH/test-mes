import React from "react";
import { Box, Paper } from "@mui/material";
const DescriptionHeader = ({ children, backgroundColor,sx }) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                backgroundColor: backgroundColor || "#1976d2",
                borderRadius: 1,
                padding: "1% 2%",
                marginBottom: 3,
                ...sx
            }}
            component={Paper}
            elevation={2}
        >
            {children}
        </Box>
    );
};

export default DescriptionHeader;
