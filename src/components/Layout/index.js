import React, { useState, useEffect } from "react";
import { CssBaseline, Box, Drawer, Hidden } from "@mui/material";
import { CustomDrawer, CustomAppBar, PageContainer } from "../index";
import { BaseMenu, ExecutionMenu } from "../../utils/drawerMenu";
import { useLocation } from "react-router-dom";
const drawerWidth = 370;

const MainLayout = () => {
  const [open, setOpen] = useState(false); // Adjust the breakpoint as needed
  const { pathname } = useLocation();
  const path = pathname.split('/')[1];
  const drawerMenu = path && path === 'base' ? BaseMenu : ExecutionMenu ?? [];
  const handleDrawer = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) { // Adjust the breakpoint as needed
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <CustomAppBar open={open} handleDrawer={handleDrawer} />
      <Box
        component="nav"
        aria-label="mailbox folders"
      >
          <Hidden smUp>
          <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <CustomDrawer open={open} items={drawerMenu} openDrawer={handleDrawer} pathname={path && path} mobile/>
        </Drawer>
          </Hidden>
       <Hidden smDown>
       <CustomDrawer open={open} items={drawerMenu} openDrawer={handleDrawer} pathname={path && path} />
       </Hidden>
      </Box>
      <PageContainer />
    </Box>
  );
};

export default MainLayout;
