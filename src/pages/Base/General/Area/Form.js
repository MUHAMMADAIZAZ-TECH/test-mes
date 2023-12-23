import React, { useEffect, useState } from "react";
import {
    Grid, Checkbox,
    FormControlLabel, FormControl,
    MenuItem, FormHelperText, Select,
} from "@mui/material";
import { CustomOutlinedInput, CustomInputLabel, ActionButtons } from "../../../../components";
import { createArea, updateArea, initArea, initialErrors, fetchAreaTypes, fetchData } from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from "../../../../AppInsightConfig";

const AreaForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [areaTypes, setAreaTypes] = useState({ loading: false, data: [], error: null });
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [area, setArea] = useState(initArea);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            area: area.areaCode === "" ? "Area Code is required" : "",
            description: area.areaDesc === "" ? "Description is required" : "",
            areaTypeCode: area.areaTypeCode === "" ? "Area type code is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: area, handleSnackbarOpen, navigate }
            if (area.areapk) {
                updateArea(body, setConfig)
            }
            else {
                createArea(body, setConfig)
            }
        }
    };
    const handleCheckboxChange = (event) => setArea({ ...area, [event.target.name]: event.target.checked === true ? "Y" : "N", });
    const handleAreaTypeChange = (event) => {
        const selectedValue = event.target.value;
        const selectedAreaType = areaTypes?.data?.find((item) => selectedValue === item.areaTypeCode);
        setArea({
            ...area,
            areaTypeCode: selectedValue,
            areaTypeDesc: selectedAreaType.areaTypeDesc,
        });
        setErrors((prev) => ({ ...prev, areaTypeCode: "" }))
    };
    useEffect(() => {
        fetchAreaTypes(setAreaTypes, handleSnackbarOpen);
    }, []);
    useEffect(() => {
        if (id) {
            fetchData(id, setArea, setConfig, handleSnackbarOpen, 'area')
        }
    }, [id])
    return (
        <Grid container padding={2}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Area Code" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={area.areaCode}
                            onChange={(e) => {
                                setArea({ ...area, areaCode: e.target.value.toUpperCase() })
                                setErrors((prev) => ({ ...prev, area: '' }))
                            }}
                            disabled={label.startsWith("Edit")}
                            width="60%"
                            error={errors.area !== ''}
                            helperText={errors.area !== '' && errors.area}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <CustomInputLabel required label="Area Type Code" />
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        display={"flex"}
                        alignItems={"center"}
                        flexDirection={"row"}
                    >
                        <FormControl sx={{ width: "60%", marginRight: "8px" }} error={errors.areaTypeCode !== ''}>
                            <Select
                                value={area.areaTypeCode}
                                onChange={handleAreaTypeChange}
                                variant="outlined"
                                size="small"
                            >
                                {areaTypes?.data?.map((item) => (
                                    <MenuItem
                                        key={item.areaTypeCode}
                                        value={item.areaTypeCode}
                                    >
                                        {item.areaTypeCode}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.areaTypeCode !== '' && errors.areaTypeCode}</FormHelperText>
                        </FormControl>
                        <CustomInputLabel label={area.areaTypeDesc} />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Description" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            multiline
                            minRows={2}
                            value={area.areaDesc}
                            onChange={(e) => {
                                setArea({ ...area, areaDesc: e.target.value, })
                                setErrors((prev) => ({ ...prev, description: '' }))
                            }}
                            width="100%"
                            error={errors.description !== ''}
                            helperText={errors.description !== '' && errors.description}
                        />
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={8}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        area.applicableForManufacturingExecution === "Y"
                                            ? true
                                            : false
                                    }
                                    onChange={handleCheckboxChange}
                                    name="applicableForManufacturingExecution"
                                />
                            }
                            label="Applicable For Manufacturing Execution"
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


export default withAITracking(reactPlugin, AreaForm,'AreaForm','area-form-class');
