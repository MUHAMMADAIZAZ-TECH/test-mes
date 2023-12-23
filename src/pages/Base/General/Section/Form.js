import React, { useEffect, useState } from "react";
import {
  Grid, Radio, RadioGroup, Checkbox,
  FormGroup, FormControlLabel, FormControl, FormLabel
} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel, ActionButtons
} from "../../../../components";
import {
  createSection,initSection, fetchData,
  updateSection, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const SectionForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [section, setSection] = useState(initSection);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: section.sectionCode === "" ? "Section code is required" : "",
      descError: section.sectionDesc === "" ? "Description is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: section, handleSnackbarOpen, navigate }
      if (section.sectionpk) {
        updateSection(body, setConfig)
      }
      else {
        createSection(body, setConfig)
      }
    }
  };
  const handleCheckboxChange = (event) => {
    setSection({
      ...section,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSection({
      ...section,
      applicableForProduct: value === "product" ? "Y" : "N",
    });
  };
  useEffect(() => {
    if (id) {
      fetchData(id, setSection, setConfig, handleSnackbarOpen,'section')
    }
  }, [id])
  return (
    // Config.loading ? <Loader /> :
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Section Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={section.sectionCode}
              onChange={(e) => {
                setSection({ ...section, sectionCode: e.target.value.toUpperCase() })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Description" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={section.sectionDesc}
              multiline
              minRows={2}
              onChange={(e) => {
                setSection({ ...section, sectionDesc: e.target.value, })
                setErrors((prev) => ({ ...prev, descError: '' }))
              }}
              width="100%"
              error={errors.descError !== ''}
              helperText={errors.descError !== '' && errors.descError}
            />
          </Grid>

          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      section.clientInfoReqd === "Y" ? true : false
                    }
                    onChange={handleCheckboxChange}
                    name="clientInfoReqd"
                  />
                }
                label="Client Information Required"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      section.expiryDateReqd === "Y" ? true : false
                    }
                    onChange={handleCheckboxChange}
                    name="expiryDateReqd"
                  />
                }
                label="Expiry Date Required"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <FormControl>
              <FormLabel>Applicable For</FormLabel>
              <RadioGroup
                value={
                  section.applicableForProduct === "Y"
                    ? "product"
                    : "ingredient"
                }
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="product"
                  control={<Radio />}
                  label="Product"
                />
                <FormControlLabel
                  value="ingredient"
                  control={<Radio />}
                  label="Ingredient"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <ActionButtons
          loading={loading}
          onClose={() =>  navigate(-1)}
          onSubmit={onSubmit}
          action={label.startsWith("Edit") || false}
        />
      </Grid>
    </Grid>
  );
};

export default SectionForm;
