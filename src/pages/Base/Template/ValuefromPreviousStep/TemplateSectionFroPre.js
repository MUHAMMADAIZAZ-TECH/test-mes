
import React from 'react';
import { CustomInputLabel, CustomAutoComplete } from '../../../../components';
import {
  FormHelperText, MenuItem, Select,
  FormControl, Grid
} from '@mui/material';

function TemplateSectionForPre({
  SectionState,
  onChangeAutoComplete,
  setSectionState,
  onDataTypeChange,
  stateData,
  label,
  fieldErrors,
  disabled
}) {

  return (
    <>
      <CustomInputLabel label={label} sx={{ color: "Blue" }} />
      <Grid display="flex" alignItems="center" container spacing={2}>
        <Grid item xs={2}>
          <CustomInputLabel required label="Stage Code" />
        </Grid>
        <Grid item xs={4}>
          <CustomAutoComplete
            options={stateData.stage.map(
              (opt) => `${opt.stageCode} | ${opt.stageDesc}`
            )}
            onChange={(value) =>
              onChangeAutoComplete("stageValue", value, setSectionState)
            }
            value={SectionState.stageValue}
            width={"100%"}
            error={fieldErrors && fieldErrors.stageValue !== ""}
            helperText={fieldErrors && fieldErrors.stageValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel required label="Test / Raw Data" />
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ width: "100%", marginRight: "8px" }} error={fieldErrors && fieldErrors.DataType !== ""}>
            <Select
              value={SectionState.DataType}
              onChange={(e) => onDataTypeChange(e, setSectionState)}
              variant="outlined"
              size="small"
              disabled={disabled}
            >
              <MenuItem value={"RawData"}>Raw Data</MenuItem>
              <MenuItem value={"Tests"}>Test</MenuItem>
            </Select>
            {fieldErrors && fieldErrors.DataType !== "" && <FormHelperText >{fieldErrors.DataType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel required label="Unit Operation Code" />
        </Grid>
        <Grid item xs={4}>
          <CustomAutoComplete
            options={stateData.unitOperation.map(
              (opt) => `${opt.mpUnitCode} | ${opt.mpUnitDesc}`
            )}
            onChange={(value) =>
              onChangeAutoComplete("unitOpValue", value, setSectionState)
            }
            value={SectionState.unitOpValue}
            width={"100%"}
            error={fieldErrors && fieldErrors.unitOpValue !== ""}
            helperText={fieldErrors && fieldErrors.unitOpValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel
            required
            label={
              SectionState.DataType === "Tests" ? 'Test Code' : 'Raw Data'
            }
          />
        </Grid>
        <Grid item xs={4}>
          <CustomAutoComplete
            options={
              SectionState.DataType === "RawData"
                ? stateData.RawData.map(
                  (opt) => `${opt.testDataCode} | ${opt.testDataDesc}`
                )
                : stateData.Tests.map(
                  (opt) => `${opt.testcode} | ${opt.testshtdesc}`
                )
            }
            disabled={disabled}
            value={
              SectionState.DataType === "RawData"
                ? SectionState.RawDataValue
                : SectionState.TestCodeValue
            }
            onChange={(value) =>
              onChangeAutoComplete(
                SectionState.DataType === "RawData"
                  ? "RawDataValue"
                  : "TestCodeValue",
                value,
                setSectionState
              )
            }
            width={"100%"}
            error={fieldErrors && fieldErrors.RawDataValue !== ""}
            helperText={fieldErrors && fieldErrors.RawDataValue}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel required label="Step Code" />
        </Grid>
        <Grid item xs={3}>
          <CustomAutoComplete
            options={stateData.step.map(
              (opt) => `${opt.stepCode} | ${opt.stepDesc}`
            )}
            onChange={(value) =>
              onChangeAutoComplete("stepValue", value, setSectionState)
            }
            disabled={disabled}
            value={SectionState.stepValue}
            width={"100%"}
            error={fieldErrors && fieldErrors.stepValue !== ""}
            helperText={fieldErrors && fieldErrors.stepValue}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default TemplateSectionForPre;