import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
    CustomOutlinedInput, CustomInputLabel,
    ActionButtons
} from "../../../../components";
import {
    fetchData, createAreaType,
    updateAreaTypes, initAreaType, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const AreaTypeForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [areaType, setareaType] = useState(initAreaType);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            CodeError: areaType.areaTypeCode === "" ? "Area type code is required" : "",
            descError: areaType.areaTypeDesc === "" ? "Description is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: areaType, handleSnackbarOpen, navigate }
            if (areaType.areatypepk) {
                updateAreaTypes(body, setConfig)
            }
            else {
                createAreaType(body, setConfig)
            }
        }
    };
    useEffect(() => {
        if (id) {
            fetchData(id, setareaType, setConfig, handleSnackbarOpen, 'areaType')
        }
    }, [id])
    return (
        // Config.loading ? <Loader /> :
        <Grid container padding={2}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Area Type Code" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={areaType.areaTypeCode}
                            onChange={(e) => {
                                setareaType({ ...areaType, areaTypeCode: e.target.value.toUpperCase() })
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
                            value={areaType.areaTypeDesc}
                            multiline
                            minRows={2}
                            onChange={(e) => {
                                setareaType({ ...areaType, areaTypeDesc: e.target.value, })
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


export default AreaTypeForm;
