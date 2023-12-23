import React from "react";
import { Breadcrumbs, Box, Typography } from "@mui/material/";
import { Link } from "react-router-dom";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const convertToTitleCase = (input) => {
  return input
    .replace(/(?:^|\b)(\w)/g, (match, letter) => letter.toUpperCase()) // Convert first letter of each word to uppercase
    .replace(/-+/g, " "); // Replace hyphens with spaces (handles multiple consecutive hyphens)
}


const CustomBreadcrumbs = ({ pathnames }) => {
  return (
    pathnames.length > 0 &&
    <Box
      sx={{
        marginLeft: 3,
        display: { xs: "none", sm: "block" },
      }}
      role="presentation"
      onClick={handleClick}
    >
      <Breadcrumbs sx={{ color: "#fff" }}>
        <Link to={`/${pathnames[0]}`} style={{ textDecoration: 'none', color: 'white' }}>
          MES
        </Link>
        {pathnames.map((pathname) => (
          <Typography key={pathname}>{convertToTitleCase(pathname)}</Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;

export { convertToTitleCase };