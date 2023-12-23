import React, { useEffect, useState } from "react";
import {
    Grid, Checkbox,
    FormGroup, FormControlLabel,
} from "@mui/material";
import { CustomOutlinedInput, CustomInputLabel, ActionButtons } from "../../../../components";
import { createUnitOpr, updateUnitOpr, initUnitOpr, 
    initialErrors, fetchData } from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const UnitOpForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [unitOpr, setUnitOpr] = useState(initUnitOpr);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            CodeError: unitOpr.mpUnitCode === "" ? "Code is required" : "",
            descError: unitOpr.mpUnitDesc === "" ? "Description is required" : "",
            commError: unitOpr.comments === "" ? "Comment is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: unitOpr, handleSnackbarOpen, navigate }
            if (unitOpr.unitoperationpk) {
                updateUnitOpr(body,setConfig)
            }
            else {
                createUnitOpr(body,setConfig)
            }
        }
    };
    const handleCheckboxChange = (event) => {
        setUnitOpr({
            ...unitOpr,
            [event.target.name]: event.target.checked === true ? "Y" : "N",
        });
    };
    useEffect(() => {
        if (id) {
            fetchData(id, setUnitOpr, setConfig, handleSnackbarOpen,'UnitOperation')
        }
    }, [id])
    return (
        <Grid container padding={2}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Unit Operation Code" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={unitOpr.mpUnitCode}
                            onChange={(e) => {
                                setUnitOpr({ ...unitOpr, mpUnitCode: e.target.value.toUpperCase() })
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
                            value={unitOpr.mpUnitDesc}
                            multiline
                            minRows={2}
                            onChange={(e) => {
                                setUnitOpr({ ...unitOpr, mpUnitDesc: e.target.value, })
                                setErrors((prev) => ({ ...prev, descError: '' }))
                            }}
                            width="100%"
                            error={errors.descError !== ''}
                            helperText={errors.descError !== '' && errors.descError}
                        />
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={8}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={unitOpr.status === "Y" ? true : false}
                                        onChange={handleCheckboxChange}
                                        name="status"
                                    />
                                }
                                label="Active"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Comments" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={unitOpr.comments}
                            onChange={(e) => {
                                setUnitOpr({
                                    ...unitOpr,
                                    comments: e.target.value,
                                })
                                setErrors((prev) => ({ ...prev, commError: "", }));
                            }}
                            error={errors.commError !== ""}
                            helperText={errors.commError !== "" && errors.commError}
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


export default UnitOpForm;
