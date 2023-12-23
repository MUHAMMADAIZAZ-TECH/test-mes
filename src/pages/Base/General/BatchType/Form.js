import React, { useEffect, useState } from "react";
import {
  Grid,
} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel, ActionButtons
} from "../../../../components";
import {
  fetchData, createBatchType,
  updateBatchType, initBatchType, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const BatchTypeForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [batchType, setBatchType] = useState(initBatchType);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: batchType.batchTypeCode === "" ? "Code is Required" : "",
      descError: batchType.batchTypeDesc === "" ? "Description is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: batchType, handleSnackbarOpen, navigate }
      if (batchType.batchtypepk) {
        updateBatchType(body, setConfig)
      }
      else {
        createBatchType(body, setConfig)
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id, setBatchType, setConfig, handleSnackbarOpen, 'batchType')
    }
  }, [id])

  return (
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Batch Type Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={batchType.batchTypeCode}
              onChange={(e) => {
                setBatchType({ ...batchType, batchTypeCode: e.target.value.toUpperCase() })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Batch Type Name" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={batchType.batchTypeDesc}
              multiline
              minRows={2}
              onChange={(e) => {
                setBatchType({ ...batchType, batchTypeDesc: e.target.value, })
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
          onClose={() =>  navigate(-1)}
          onSubmit={onSubmit}
          action={label.startsWith("Edit") || false}
        />
      </Grid>
    </Grid>
  );
};


export default BatchTypeForm;
