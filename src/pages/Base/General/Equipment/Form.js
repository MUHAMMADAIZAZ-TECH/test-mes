import React, { useEffect, useState } from "react";
import {
  Grid, MenuItem,
  FormControl, Select, FormHelperText
} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,
  ActionButtons
} from "../../../../components";
import {
  fetchData, createEquipment, fetchEquipmentTypes,
  updateEquipment, initEquipment, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const EquipmentForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [equipmentTypes, setEquipmentTypes] = useState([])
  const [equipment, setEquipment] = useState(initEquipment);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: equipment.insCode === "" ? "Code is Required" : "",
      descError: equipment.insName === "" ? "Description is required" : "",
      serNoError: equipment.serialNo === "" ? "Serial No is required" : "",
      EquipType: equipment.insTypeCode === "" ? "Type is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: equipment, handleSnackbarOpen, navigate }
      if (equipment.equipmentpk) {
        updateEquipment(body, setConfig)
      }
      else {
        createEquipment(body, setConfig)
      }
    }
  };
  const handleEquipmentTypeChange = (event) => {
    setErrors((prev) => ({ ...prev, EquipType: "", }));
    const selectedValue = event.target.value;
    const selectedAreaType = equipmentTypes.find(
      (item) => selectedValue === item.insTypeCode
    );
    setEquipment({
      ...equipment,
      insTypeCode: selectedValue,
      insTypeDesc: selectedAreaType.insTypeDesc,
    });
  };


  useEffect(() => {
    if (id) {
      fetchData(id, setEquipment, setConfig, handleSnackbarOpen, 'equipment')
    }
  }, [id])
  useEffect(() => {
    fetchEquipmentTypes(setEquipmentTypes, handleSnackbarOpen);
  }, []);
  return (
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Equipment Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={equipment.insCode}
              onChange={(e) => {
                setEquipment({ ...equipment, insCode: e.target.value })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>


          <Grid item xs={4}>
            <CustomInputLabel required label="Serial No" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={equipment.serialNo}
              onChange={(e) => {
                setEquipment({
                  ...equipment,
                  serialNo: e.target.value,
                })
                setErrors((prev) => ({ ...prev, serNoError: "", }));
              }}
              width="60%"
              error={errors.serNoError !== ''}
              helperText={errors.serNoError !== '' && errors.serNoError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Equipment Type" />
          </Grid>

          <Grid
            item
            xs={8}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
          >
            <FormControl sx={{ width: "60%", marginRight: "8px" }} error={errors.EquipType !== ''}>
              <Select
                value={equipment.insTypeCode}
                onChange={handleEquipmentTypeChange}
                variant="outlined"
                size="small"
              >
                {equipmentTypes.length > 0
                  && equipmentTypes.map((item) => (
                    <MenuItem
                      key={item.insTypeCode}
                      value={item.insTypeCode}
                    >
                      {item.insTypeCode}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{errors.EquipType !== '' && errors.EquipType}</FormHelperText>
            </FormControl>
            <CustomInputLabel label={equipment.insTypeDesc} />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Equipment Description" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={equipment.insName}
              multiline
              minRows={2}
              onChange={(e) => {
                setEquipment({ ...equipment, insName: e.target.value, })
                setErrors((prev) => ({ ...prev, descError: '' }))
              }}
              width="100%"
              error={errors.descError !== ''}
              helperText={errors.descError !== '' && errors.descError}
            />
          </Grid>
        </Grid>
        <ActionButtons
          loading={loading}
          onClose={() => navigate(-1)}
          onSubmit={onSubmit}
          action={label.startsWith("Edit") || false}
        />
      </Grid>
    </Grid>
  );
};


export default EquipmentForm;
