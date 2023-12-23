import React, { useEffect, useState } from "react";
import {
    Grid, Checkbox,
    FormGroup, FormControlLabel,
} from "@mui/material";
import { CustomOutlinedInput, CustomInputLabel, CustomButton, ActionButtons } from "../../../../components";
import { createTemplate, updateTemplate, 
    initTemplate, initialErrors, fetchData } from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const TempDefForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [template, setTemplate] = useState(initTemplate);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        const newErrors = {
            ...errors,
            CodeError: template.tempCode === "" ? "Code is required" : "",
            descError: template.tempDesc === "" ? "Description is required" : "",
            commError: template.comments === "" ? "Comment is required" : "",
            revisioError: template.revisionNo === "" ? "Revision No is required" : "",
            sopError: template.sopNo === "" ? "SOP No is required" : "",
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            let body = { body: template, handleSnackbarOpen, navigate }
            if (template.templatepk) {
                updateTemplate(body,setConfig)
            }
            else {
                createTemplate(body,setConfig)
            }
        }
    };
    const handleCheckboxChange = (event) => {
        setTemplate({
            ...template,
            [event.target.name]: event.target.checked === true ? "Y" : "N",
        });
    };
    useEffect(() => {
        if (id) {
          fetchData(id, setTemplate, setConfig, handleSnackbarOpen,'TemplateDefinition')
        }
    }, [id])
    return (
        <Grid container padding={2}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label="Template Code" />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            value={template.tempCode}
                            onChange={(e) => {
                                setTemplate({ ...template, tempCode: e.target.value.toUpperCase() })
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
                            value={template.tempDesc}
                            multiline
                            minRows={2}
                            onChange={(e) => {
                                setTemplate({ ...template, tempDesc: e.target.value, })
                                setErrors((prev) => ({ ...prev, descError: '' }))
                            }}
                            width="100%"
                            error={errors.descError !== ''}
                            helperText={errors.descError !== '' && errors.descError}
                        />
                    </Grid>
                    <Grid item xs={4}>
                  <CustomInputLabel required label="SOP#" />
                </Grid>
                <Grid item xs={8}>
                  <CustomOutlinedInput
                    value={template.sopNo}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        sopNo: e.target.value,
                      })
                      setErrors((prev) => ({ ...prev, sopError: "", }));

                    }}
                    width={"25%"}
                    error={errors.sopError !== ''}
                    helperText={errors.sopError !== '' && errors.sopError}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Revision No." />
                </Grid>
                <Grid item xs={8}>
                  <CustomOutlinedInput
                    value={template.revisionNo}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        revisionNo: e.target.value,
                      })
                      setErrors((prev) => ({ ...prev, revisioError: "", }));
                    }}
                    width={"25%"}
                    error={errors.revisioError !== ''}
                    helperText={errors.revisioError !== '' && errors.revisioError}
                  />
                </Grid>

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={template.status === "Y" ? true : false}
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
                    value={template.comments}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        comments: e.target.value,
                      })
                      setErrors((prev) => ({ ...prev, commError: "", }));
                    }}
                    multiline
                    minRows={2}
                    width={"100%"}
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


export default TempDefForm;
