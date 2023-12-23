import React, { useEffect, useState } from "react";
import { Grid} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,ActionButtons
} from "../../../../components";
import {
  fetchData, createClient,
  updateClient, initClient, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const ClientForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [client, setClient] = useState(initClient);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: client.custID === "" ? "Customer ID is Required" : "",
      nameError: client.custName === "" ? "Name is required" : "",
      addressError: client.address === "" ? "Address is required" : "",
      PhoneError: client.phoneNo === "" ? "Phone No is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: client, handleSnackbarOpen, navigate }
      if (client.customerpk) {
        updateClient(body, setConfig)
      }
      else {
        createClient(body, setConfig)
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id, setClient, setConfig, handleSnackbarOpen, 'customer')
    }
  }, [id])

  return (
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Client Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={client.custID}
              onChange={(e) => {
                setClient({ ...client, custID: e.target.value.toUpperCase() })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Client Name" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={client.custName}
              onChange={(e) => {
                setClient({ ...client, custName: e.target.value, })
                setErrors((prev) => ({ ...prev, nameError: '' }))
              }}
              width="100%"
              error={errors.nameError !== ''}
              helperText={errors.nameError !== '' && errors.nameError}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomInputLabel required label="Client Phone No" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={client.phoneNo}
              onChange={(e) => {
                setClient({ ...client, phoneNo: e.target.value })
                setErrors((prev) => ({ ...prev, PhoneError: "", }));
              }}
              width="100%"
              error={errors.PhoneError !== ''}
              helperText={errors.PhoneError !== '' && errors.PhoneError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Client Address" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={client.address}
              onChange={(e) => {
                setClient({ ...client, address: e.target.value })
                setErrors((prev) => ({ ...prev, addressError: "", }));
              }}
              multiline
              minRows={2}
              error={errors.addressError !== ''}
              helperText={errors.addressError !== '' && errors.addressError}
              width="100%"
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


export default ClientForm;
