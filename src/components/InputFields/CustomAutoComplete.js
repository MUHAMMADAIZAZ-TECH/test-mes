import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function CustomAutoComplete({
  options,
  size,
  width,
  placeholder,
  value,
  inputValue,
  onChange,
  onInputChange,
  disabled,
  error,
  helperText,
  required
}) {
  return (
    <Autocomplete
      value={value || null}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        onInputChange && onInputChange(newInputValue);
      }}
      options={options}
      sx={{ width: width || "40%" }}
      size={size || "small"}
      disabled={disabled || false}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} error={error} helperText={helperText} required={required} />
      )}
    />
  );
}
const AutoComplete = ({
  options,
  size,
  width,
  placeholder,
  value,
  inputValue,
  onChange,
  onInputChange,
  disabled,
  label,
  error,
  helperText,
  required,
  name,
  getOptionLabel,
  renderOption,
  sx,
  freeSolo
}) => {
  return (
    <Autocomplete
      value={options.find((item) => item[`${name}`] === value) || null}
      freeSolo={freeSolo}
      onChange={(_, value) => {
        value ? onChange({ target: { name, value: value[`${name}`] } }, value) :
          onChange({ target: { name, value: '' } }, value);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        onInputChange && onInputChange(newInputValue);
      }}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      options={options}
      sx={{ width: width || "40%", ...sx }}
      size={size || "small"}
      disabled={disabled || false}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
    />
  );
}
export { AutoComplete };