import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { CustomOutlinedInput, CustomInputLabel, ActionButtons } from "../../../../components";
import {
    createStepCategory, updateStepCategory,
    initStepCategory, initialErrors, fetchData
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const StepCatForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [stepCategory, setStepCategory] = useState(initStepCategory);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            CodeError: stepCategory.stepCateCode === "" ? "Code is required" : "",
            descError: stepCategory.stepCateDesc === "" ? "Description is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: stepCategory, handleSnackbarOpen, navigate }
            if (stepCategory.stepcategorypk) {
                updateStepCategory(body, setConfig)
            }
            else {
                createStepCategory(body, setConfig)
            }
        }
    };
    useEffect(() => {
        if (id) {
            fetchData(id, setStepCategory, setConfig, handleSnackbarOpen, 'StepCategory')
        }
    }, [id])
    return (
        <Grid container padding={2}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Step Category Code" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={stepCategory.stepCateCode}
                            onChange={(e) => {
                                setStepCategory({ ...stepCategory, stepCateCode: e.target.value.toUpperCase() })
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
                            value={stepCategory.stepCateDesc}
                            multiline
                            minRows={2}
                            onChange={(e) => {
                                setStepCategory({ ...stepCategory, stepCateDesc: e.target.value, })
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


export default StepCatForm;
