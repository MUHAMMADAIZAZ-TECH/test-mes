import React, { useEffect, useState } from "react";
import {
  Grid ,Checkbox,
  FormGroup, FormControlLabel
} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,
  ActionButtons
} from "../../../../components";
import {
  fetchData, createEquipmentType,
  updateEquipmentType, initEquipmentType, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const EquipTypeForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [equipmentType, setEquipmentType] = useState(initEquipmentType);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: equipmentType.insTypeCode === "" ? "Equipment type code is required" : "",
      descError: equipmentType.insTypeDesc === "" ? "Description is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: equipmentType, handleSnackbarOpen, navigate }
      if (equipmentType.equipmenttypepk) {
        updateEquipmentType(body,setConfig)
      }
      else {
        createEquipmentType(body,setConfig)
      }
    }
  };
  const handleCheckboxChange = (event) => {
    setEquipmentType({
      ...equipmentType,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  useEffect(() => {
    if (id) {
      fetchData(id, setEquipmentType, setConfig, handleSnackbarOpen,'equipmentType')
    }
  }, [id])
  return (
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Equipment Type Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={equipmentType.insTypeCode}
              onChange={(e) => {
                setEquipmentType({ ...equipmentType, insTypeCode: e.target.value })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Equipment Type Name" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={equipmentType.insTypeDesc}
              multiline
              minRows={2}
              onChange={(e) => {
                setEquipmentType({ ...equipmentType, insTypeDesc: e.target.value, })
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
                      equipmentType.calDueDateAp === "N" ? false : true
                    }
                    onChange={handleCheckboxChange}
                    name="calDueDateAp"
                  />
                }
                label="Calibration Due Date Applicable"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={equipmentType.cltrApp === "N" ? false : true}
                    onChange={handleCheckboxChange}
                    name="cltrApp"
                  />
                }
                label="CLTR# Applicable"
              />
            </FormGroup>
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


export default EquipTypeForm;
