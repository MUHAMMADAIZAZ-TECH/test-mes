import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const drawerWidth = 370;

const CustomListItemText = styled(ListItemText)(({ fontSize, fontWeight }) => ({
  "& .MuiTypography-root": {
    fontSize: fontSize,
    fontWeight: fontWeight,
  },
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const CustomDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const CustomDrawer = ({ open, items, openDrawer,pathname ,mobile}) => {
  const navigate = useNavigate();

  const [openNestedItems, setOpenNestedItems] = React.useState({});

  const navigateTo = (item) => {
    mobile && openDrawer()
    item.link && navigate(`/${pathname}/${item.link}`);
  };

  React.useEffect(() => {
    return () => {
      open && setOpenNestedItems({});
    };
  }, [open]);

  const handleClick = (keyPath) => {
    if (!open) openDrawer();
    setOpenNestedItems((prevState) => {
      const newState = { ...prevState };
      newState[keyPath] = !prevState[keyPath];
      return newState;
    });
  };

  const renderNestedItems = (nestedItems, level = 1, keyPath = "") => {
    return nestedItems.map((item, index) => {
      const { label, icon, nestedItems } = item;
      const currentKeyPath = keyPath + index;
      const isOpen = openNestedItems[currentKeyPath];
      const hasNestedItems = nestedItems && nestedItems.length > 0;

      if (hasNestedItems) {
        return (
          <React.Fragment key={index}>
            <ListItemButton
              sx={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: "8px",
                paddingRight: "8px",
                pl: level * 4,
              }}
              onClick={() => handleClick(currentKeyPath)}
            >
              <ListItemIcon sx={{ minWidth: 0, marginRight: "8px" }}>
                {icon}
              </ListItemIcon>
              <CustomListItemText
                primary={label}
                fontSize="12px"
                fontWeight="bold"
              />

              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNestedItems(
                  nestedItems,
                  level + 1,
                  currentKeyPath + "-"
                )}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      return (
        <ListItemButton
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: "8px",
            paddingRight: "8px",
            pl: level * 4,
          }}
          key={index}
          onClick={() => {
            navigateTo(item);
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, marginRight: "8px" }}>
            {icon}
          </ListItemIcon>
          <CustomListItemText
            primary={label}
            fontSize="12px"
            fontWeight="normal"
          />
        </ListItemButton>
      );
    });
  };

  return (
    <Drawer variant="permanent" open={open}>
      <CustomDrawerHeader />
      <Divider />
      <List>
        {items.map((item, index) => {
          const { label, icon, nestedItems } = item;
          const isOpen = openNestedItems[label];
          const hasNestedItems = nestedItems && nestedItems.length > 0;

          if (hasNestedItems) {
            return (
              <React.Fragment key={index}>
                <ListItemButton
                  sx={{
                    paddingLeft: !open ? "16px" : "8px",
                    paddingRight: "8px",
                  }}
                  onClick={() => handleClick(label)}
                >
                  <ListItemIcon sx={{ minWidth: 0, marginRight: "8px" }}>
                    {icon}
                  </ListItemIcon>
                  {open && (
                    <CustomListItemText
                      primary={label}
                      fontSize="14px"
                      fontWeight="normal"
                    />
                  )}
                  {open ? isOpen ? <ExpandLess /> : <ExpandMore /> : null}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderNestedItems(nestedItems)}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          return (
            <ListItemButton
              sx={{ paddingTop: "2px", paddingBottom: "2px" }}
              key={index}
            >
              <ListItemIcon sx={{ minWidth: 0, marginRight: "8px" }}>
                {icon}
              </ListItemIcon>
              <CustomListItemText
                primary={label}
                fontSize="14px"
                fontWeight="normal"
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export { CustomDrawerHeader, CustomDrawer };
