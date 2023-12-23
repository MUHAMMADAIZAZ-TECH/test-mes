import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingButton from '@mui/lab/LoadingButton';
const CustomButton = ({
  backgroundColor,
  variant,
  onClick,
  children,
  startIcon,
  disabled,
  sx: additionalStyles,
}) => {
  return (
    <Button
      sx={{
        fontSize: "0.772rem",
        backgroundColor: { backgroundColor },
        "&:hover": {
          backgroundColor: { backgroundColor },
        },
        padding: "5px 10px",
        ...additionalStyles,
      }}
      variant={variant}
      onClick={onClick}
      startIcon={startIcon || null}
      disabled={disabled || false}
    >
      {children}
    </Button>
  );
};

const CustomIconButton = ({ onClick, Icon }) => {
  return <IconButton onClick={onClick}>{Icon}</IconButton>;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUploadButton = ({
  text,
  onChange,
  backgroundColor,
  additionalStyles,
  size
}) => {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };

  return (
    <Button
      sx={{
        fontSize: "0.772rem",
        backgroundColor: { backgroundColor },
        "&:hover": {
          backgroundColor: { backgroundColor },
        },
        padding: "5px 10px",
        ...additionalStyles,
      }}
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      size={size}
    >
      {text}
      <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
    </Button>
  );
};

const CustomLoadingButton = ({
  backgroundColor,
  variant,
  onClick,
  children,
  startIcon,
  disabled,
  loadingPosition,
  loading,
  color,
  size,
  sx: additionalStyles,
}) => {
  return (
    <LoadingButton
      sx={{
        fontSize: "0.772rem",
        backgroundColor: { backgroundColor },
        "&:hover": {
          backgroundColor: { backgroundColor },
        },
        padding: "5px 10px",
        ...additionalStyles,
      }}
      size={size}
      color={color}
      loadingPosition={loadingPosition}
      variant={variant}
      onClick={onClick}
      loading={loading}
      startIcon={startIcon || null}
      disabled={disabled || false}
    >
      <span> {children}</span>
    </LoadingButton>
  );
};
export { CustomButton, CustomIconButton, FileUploadButton,CustomLoadingButton };
