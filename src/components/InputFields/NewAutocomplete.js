import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const AutoComplete = ({
  fetchOptions, // Your function to fetch options from the server
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
  const [options, setOptions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch initial options when the component mounts
    fetchOptionsFromServer();
  }, []);

  const fetchOptionsFromServer = async () => {
    try {
      const response = await fetchOptions({
        input: inputValue,
        page: currentPage,
      });

      // Assuming the server response has a structure like { options: [], totalPages: 1 }
      const { options: newOptions, totalPages: newTotalPages } = response;

      setOptions(newOptions);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    onInputChange && onInputChange(newInputValue);
    setCurrentPage(1); // Reset current page when input changes
  };

  const handleChange = (_, selectedValue) => {
    const newValue = selectedValue ? selectedValue[`${name}`] : '';
    onChange({ target: { name, value: newValue } }, selectedValue);
  };

  const handleMenuPopupOpen = () => {
    // Fetch more options when the menu is opened
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchOptionsFromServer();
    }
  };

  return (
    <Autocomplete
      value={options.find((item) => item[`${name}`] === value) || null}
      freeSolo={freeSolo}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      options={options}
      sx={{ width: width || '40%', ...sx }}
      size={size || 'small'}
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
      onMenuOpen={handleMenuPopupOpen}
    />
  );
};

export default AutoComplete;
