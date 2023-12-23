import React from "react";
import {
  InputLabel, IconButton, Box, Input, FormControl,
  MenuItem, Select, FormHelperText, TextField,
  FormControlLabel, OutlinedInput, Checkbox,
} from "@mui/material";
import { DatePicker, StaticDatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
const CustomInput = ({
  value,
  onChange,
  width,
  multiline,
  minRows,
  size,
  disabled,
  type,
  sx: additionalStyles,
}) => {
  return (
    <Input
      sx={{
        width: width || "40%",
        ...additionalStyles,
      }}
      disableUnderline
      size={size || "small"}
      value={value}
      disabled={disabled || false}
      onChange={onChange}
      multiline={multiline || false}
      minRows={minRows || 1}
      type={type || "text"}
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
      }}
    />
  );
};
const CustomOutlinedInput = ({
  value,
  onChange,
  width,
  multiline,
  minRows,
  size,
  disabled,
  type,
  sx: additionalStyles,
  error,
  helperText,
  name
}) => {
  return (
    <FormControl
      sx={{
        width: width || "40%",
        ...additionalStyles,
      }}
      error={error}
    >
      <OutlinedInput
        name={name}
        size={size || "small"}
        value={value}
        disabled={disabled || false}
        onChange={onChange}
        multiline={multiline || false}
        minRows={minRows || 1}
        type={type || "text"}
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        error={error}
      />
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>

  );
};

const CustomLookupInput = ({
  value,
  onChange,
  width,
  multiline,
  minRows,
  size,
  onClick,
  icon,
  disabled,
  sx: additionalStyles,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...additionalStyles,
      }}
    >
      <OutlinedInput
        sx={{
          width: width || "40%",
        }}
        size={size || "small"}
        value={value}
        disabled={disabled || false}
        onChange={onChange}
        multiline={multiline || false}
        minRows={minRows || 1}
      />
      <IconButton
        disabled={disabled || false}
        sx={{
          marginLeft: "8px",
          padding: "4px",
        }}
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Box>
  );
};

const CustomLookupInputWithLabel = ({
  value,
  onChange,
  width,
  multiline,
  minRows,
  size,
  onClick,
  icon,
  disabled,
  label,
  sx: additionalStyles,
  required,
  error,
  helperText
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...additionalStyles,
      }}
    >
      <FormControl sx={{ width: width || "40%" }} error={error}>
        <OutlinedInput
          size={size || "small"}
          value={value}
          disabled={disabled || false}
          onChange={onChange}
          multiline={multiline || false}
          minRows={minRows || 1}
          required={required}
          error={error}
        />
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
      <IconButton
        disabled={disabled || false}
        sx={{
          marginLeft: "8px",
          marginRight: "8px",
          padding: "4px",
        }}
        onClick={onClick}
      >
        {icon}
      </IconButton>
      <CustomInputLabel label={label} />

    </Box>
  );
};

const CustomInputLabel = ({ required, label, sx: additionalStyles }) => {
  return (
    <InputLabel
      required={required || false}
      sx={{
        ...additionalStyles,
      }}
    >
      {label}
    </InputLabel>
  );
};

const SelectBox = ({
  label,
  options,
  helperText,
  value,
  handleChange,
  error,
  sx,
  size = "small",
  disabled,
  name,
  property
}) => {
  return (
    <FormControl
      sx={{ minWidth: 120, ...sx }}
      error={error && error}
      required size={size}
      disabled={disabled}
    >
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        value={value}
        label={label}
        name={name}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option[property]} value={option[property]}>
            {option[property]}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
const InputField = ({
  id,
  label,
  value,
  defaultValue,
  helperText,
  onChange,
  fullWidth,
  variant,
  error,
  required,
  name,
  size = "small",
  disabled,
  multiline,
  rows,
  sx
}) => {
  return (
    <TextField
      multiline={multiline}
      minRows={rows}
      name={name}
      disabled={disabled}
      id={id || label}
      label={label}
      value={value || ''}
      defaultValue={defaultValue}
      helperText={helperText}
      onChange={onChange}
      size={size}
      fullWidth={fullWidth || false}
      variant={variant || 'outlined'}
      error={error || false}
      required={required || false}
      sx={sx}
    />
  );
};


const CustomCheckbox = ({ checked, onChange, name, label, error, helperText, disabled ,value}) => {
  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} name={name} value={value}/>}
        label={label}
        disabled={disabled}
      />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </>
  );
};


const CustomDatePicker = ({ name, label, value, onChange, error, required, size, helperText, width, disabled }) => {
  return (
    <DatePicker
      sx={{ width }}
      disabled={disabled}
      label={label}
      value={value ? DateTime.fromISO(value) : null} // Convert to DateTime only if value is not null
      onChange={(newValue) => onChange({ target: { name, value: newValue ? DateTime.fromISO(newValue).toISODate() : '' } })}
      required={required}
      slotProps={{
        textField: {
          helperText: error ? helperText : false,
          error,
          size,
          name
        },
      }}
    />
  );
};

const CustomStaticDate = ({ label, value, onChange, error, required, size, helperText, width }) => {
  return (
    <StaticDatePicker
      sx={{ width }}
      label={label}
      value={DateTime.fromISO(value)}
      onChange={(newValue) => onChange(DateTime.fromISO(newValue))}
      required={required}
      slotProps={{
        textField: {
          helperText: error ? helperText : false,
          error: error,
          size: size,
        },
      }}
    />
  );
}
const CustomDateTimepicker = ({ name,label, value, onChange, error,required, size, helperText, width,disabled }) => {
  return (
    <DateTimePicker
    sx={{ width }}
    disabled={disabled}
    label={label}
    value={value ? DateTime.fromISO(value) : null} // Convert to DateTime only if value is not null
    onChange={(newValue) => onChange({ target: { name, value: newValue ? DateTime.fromISO(newValue).toISO() : '' } })}
    required={required}
    slotProps={{
      textField: {
        helperText: error ? helperText : false,
        error,
        size,
        name
      },
    }}
    />
  );
}
export {
  CustomDateTimepicker,
  CustomStaticDate,
  CustomDatePicker,
  CustomOutlinedInput,
  CustomInputLabel,
  CustomLookupInput,
  CustomLookupInputWithLabel,
  CustomInput,
  SelectBox,
  InputField,
  CustomCheckbox
};
