import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { CustomDrawerHeader } from "./CustomDrawer";
import { Outlet, useLocation } from "react-router-dom";
import CustomPageHeader from "../Header/CustomPageHeader";
import CustomSnackbar from "../Dialog-Modals/CustomSnackbar";
import CustomDialog from "../Dialog-Modals/CustomDialog";
import { useDialog, useSnackbar } from "../../hooks";
import { convertToTitleCase } from "../Header/CustomBreadcrumbs";
import { useDispatch } from "react-redux";
import { ProductMPR ,EquipmentList} from "../../store/Execution/ProductMpr/Mpr.Apis";

const PageContainer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [Config, setConfig] = useState({ loading: false, error: null });
  const pathnames = location.pathname.split("/").filter((x) => x);

  const { dialog, handleAction, handleConfirm, handleCloseDialog } = useDialog();
  const { snackbar, handleSnackbarOpen, handleSnackbarClose } = useSnackbar();
  useEffect(()=>{
    dispatch(ProductMPR());
    dispatch(EquipmentList());
  },[])
  return (
    <Container
      component="main"
      maxWidth='auto'
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${370}px)`} }}
    >
      <CustomDrawerHeader />
      {pathnames[2] && <CustomPageHeader heading={convertToTitleCase(pathnames[2])} />}
      <Outlet context={[handleAction, handleSnackbarOpen, setConfig, Config]} />
      <CustomSnackbar
        type={snackbar.type}
        text={snackbar.text}
        open={snackbar.open}
        handleClose={handleSnackbarClose}
      />
      <CustomDialog
        open={dialog.open}
        onClose={handleCloseDialog}
        onClick={handleConfirm}
        text={dialog.message}
        positiveButtonText={"Yes"}
        negativeButtonText={"No"}
      />
    </Container>
  );
};

export default PageContainer;
