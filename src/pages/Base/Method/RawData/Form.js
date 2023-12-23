import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { CustomOutlinedInput, CustomInputLabel, ActionButtons } from "../../../../components";
import { createRawData, updateRawData, initRawData, initialErrors, fetchRawData, fetchData } from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const RawDataForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [rawData, setRawData] = useState(initRawData);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            CodeError: rawData.testDataCode === "" ? "Code is required" : "",
            descError: rawData.testDataDesc === "" ? "Description is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: rawData, handleSnackbarOpen, navigate }
            if (rawData.testdatapk) {
                updateRawData(body,setConfig)
            }
            else {
                createRawData(body,setConfig)
            }
        }
    };
 
    useEffect(() => {
        if (id) {
            fetchData(id, setRawData,setConfig, handleSnackbarOpen,'RawData')
        }
    }, [id])
    return (
        <Grid container padding={2}>
        <Grid item xs={12} sm={10} md={8} lg={6}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                    <CustomInputLabel required label="Raw Data Code" />
                </Grid>
                <Grid item xs={8}>
                    <CustomOutlinedInput
                        value={rawData.testDataCode}
                        onChange={(e) => {
                            setRawData({ ...rawData, testDataCode: e.target.value.toUpperCase() })
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
                        value={rawData.testDataDesc}
                        multiline
                        minRows={2}
                        onChange={(e) => {
                            setRawData({ ...rawData, testDataDesc: e.target.value, })
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


export default RawDataForm;
