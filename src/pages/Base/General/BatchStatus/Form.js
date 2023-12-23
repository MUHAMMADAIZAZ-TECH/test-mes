import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,
  ActionButtons
} from "../../../../components";
import {
  fetchData, createBatchStatus,
  updateBatchStatus, initBatchStatus, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const BatchStatusForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [batchStatus, setBatchStatus] = useState(initBatchStatus);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: batchStatus.batchStatusCode === "" ? "Equipment type code is required" : "",
      descError: batchStatus.batchStatusDesc === "" ? "Description is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: batchStatus, handleSnackbarOpen, navigate }
      if (batchStatus.batchstatuspk) {
        updateBatchStatus(body, setConfig)
      }
      else {
        createBatchStatus(body, setConfig)
      }
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id, setBatchStatus, setConfig, handleSnackbarOpen, 'batchStatus')
    }
  }, [id])
  return (
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Batch status Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={batchStatus.batchStatusCode}
              onChange={(e) => {
                setBatchStatus({ ...batchStatus, batchStatusCode: e.target.value.toUpperCase() })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Batch status Name" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={batchStatus.batchStatusDesc}
              onChange={(e) => {
                setBatchStatus({ ...batchStatus, batchStatusDesc: e.target.value, })
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


export default BatchStatusForm;
