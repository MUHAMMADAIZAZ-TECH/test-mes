import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {CustomButton} from "../Buttons/Buttons"; // Import your CustomButton component

const CustomDialog = ({
  open,
  onClose,
  onClick,
  text,
  positiveButtonText,
  negativeButtonText,
}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{text}</DialogTitle>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 3,
        }}
      >
        <Stack spacing={1} direction="row">
          <CustomButton color="#28B463" variant="contained" onClick={onClick}>
            {positiveButtonText}
          </CustomButton>
          <CustomButton
            backgroundColor="#E74C3C"
            variant="contained"
            onClick={onClose}
          >
            {negativeButtonText}
          </CustomButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default CustomDialog;
