import React, { useEffect, useState } from "react";
import {
    Grid, Checkbox,
    FormGroup, FormControlLabel,
} from "@mui/material";
import { CustomOutlinedInput, CustomInputLabel, ActionButtons } from "../../../../components";
import { createStage, updateStage, initStage, initialErrors, fetchData } from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const StageForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [stage, setStage] = useState(initStage);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            CodeError: stage.stageCode === "" ? "Code is required" : "",
            descError: stage.stageDesc === "" ? "Description is required" : "",
            commError: stage.comments === "" ? "Comment is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: stage, handleSnackbarOpen, navigate }
            if (stage.stagepk) {
                updateStage(body,setConfig)
            }
            else {
                createStage(body,setConfig)
            }
        }
    };
    const handleCheckboxChange = (event) => {
        setStage({
            ...stage,
            [event.target.name]: event.target.checked === true ? "Y" : "N",
        });
    };
    useEffect(() => {
        if (id) {
            fetchData(id, setStage, setConfig, handleSnackbarOpen,'stage')
        }
    }, [id])
    return (
        <Grid container padding={2}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Stage Code" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={stage.stageCode}
                            onChange={(e) => {
                                setStage({ ...stage, stageCode: e.target.value.toUpperCase() })
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
                            value={stage.stageDesc}
                            multiline
                            minRows={2}
                            onChange={(e) => {
                                setStage({ ...stage, stageDesc: e.target.value, })
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
                                        checked={stage.status === "Y" ? true : false}
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
                            value={stage.comments}
                            onChange={(e) => {
                                setStage({
                                    ...stage,
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


export default StageForm;
