export const isNotEmpty = (value) => {
    return !!value && value.trim() !== '';
  };
  
  export const validateArea = (area) => {
    const errors = {};
  
    if (!isNotEmpty(area.areaDesc)) {
      errors.areaDesc = 'Description is required';
    }
  
    if (!isNotEmpty(area.areaTypeCode)) {
      errors.areaTypeCode = 'Area Type Code is required';
    }
  
    return errors;
  };
  export const validateRequiredFields = (formData, requiredFields) => {
    for (const fieldName of requiredFields) {
      const value = formData[fieldName];
      if (!value || value.trim() === '') {
        return false; // Validation failed
      }
    }
    return true; // All required fields are filled
  };
  export const validateRequiredField = (fieldValue) => {
    return !!fieldValue && fieldValue.trim() !== '';
  };