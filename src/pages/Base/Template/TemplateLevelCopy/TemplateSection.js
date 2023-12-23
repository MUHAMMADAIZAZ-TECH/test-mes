// TargetSection.js
import React from "react";
import { Grid } from "@mui/material";
import { CustomInputLabel,CustomAutoComplete } from "../../../../components";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const TemplateSection = ({
    Templates,
    State,
    onTemplateCode,
    onChange,
    label
}) => {
    const { tempName, StageCode, UnitCode,Template } = State
    return (
        <>
            <CustomInputLabel label={label} sx={{ color: "Blue" }} />
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                    <CustomInputLabel required label="Template Code" />
                </Grid>
                <Grid item xs={8}>
                    <CustomAutoComplete
                        options={Templates.map(
                            (opt) => `${opt.tempCode} | ${opt.tempDesc}`
                        )}
                        onChange={onTemplateCode}
                        value={tempName}
                        width={"100%"}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomInputLabel required label="Stage Code" />
                </Grid>
                <Grid item xs={8}>
                    <FormControl sx={{ width: "100%", marginRight: "8px" }}>
                        <Select
                            value={StageCode}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            name="StageCode"
                        >
                            {Template && Template.stage.map(
                                (opt) => (<MenuItem value={opt.stageCode}>{`${opt.stageCode} | ${opt.stageDesc}`}</MenuItem>)
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <CustomInputLabel required label="Unit Operation" />
                </Grid>
                <Grid item xs={8}>
                    <FormControl sx={{ width: "100%", marginRight: "8px" }}>
                        <Select
                            value={UnitCode}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            name="UnitCode"
                        >
                            {Template && Template.unitOperation.map(
                                (opt) => (<MenuItem value={opt.mpUnitCode}>{`${opt.mpUnitCode} | ${opt.mpUnitDesc}`}</MenuItem>)
                            )}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
};

export default TemplateSection;
