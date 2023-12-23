import React from "react";
import { Modal, Paper } from "@mui/material";

const CustomModal = ({ open, onClose, content, width, maxHeight }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Paper
        sx={{
          width: width || "80%",
          maxHeight: maxHeight || "80%",
          overflow: "auto",
        }}
      >
        {content}
      </Paper>
    </Modal>
  );
};

export default CustomModal;
