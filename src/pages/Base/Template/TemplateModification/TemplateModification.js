import React, { useEffect, useState } from "react";
import { Box, Stack, Grid, FormControl, Select, MenuItem, FormHelperText } from "@mui/material";
import {
  CustomInputLabel, CustomButton,
  CustomAutoComplete,
  CustomTableReorder, CustomLoadingButton
} from "../../../../components";
import api from "../../../../api/api";
import { Close, Search, Update } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const TemplateModification = () => {
  const [loading, setloading] = useState(false);
  const [Table, setTable] = useState(InitialTable);
  const [TargetProduct, setTargetProduct] = useState(InitialState);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [,handleSnackbarOpen] = useOutletContext();

  async function fetchTemplates() {
    try {
      const response = await api.get("/Template");
      if (response.data) {
        setTargetProduct((prev) => ({
          ...prev,
          templates: response.data,
        }));
      }
    } catch ({ response }) {
      handleSnackbarOpen('error', 'An error occured while fetching Templates')
      console.error(response);
    }
  }
  async function fetchTemplatesById(id) {
    try {
      const response = await api.get(`/Template/${id}`);
      return response.data;
    } catch ({ response }) {
      handleSnackbarOpen('error', `An error occured while fetching Template ${id}`)
      console.error(response);
    }
  }
  async function handleTemplateModification(body) {
    try {
      const response = await api.put(`/Template/${body.tempCode}`, body);
      handleSnackbarOpen('success', `Tempplate updated successfully`)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  const onTemplateCode = async (tempName, setstate) => {
    const values = tempName?.split(" | ");
    if (tempName !== undefined && tempName !== null) {
      const tempCode = values[0] || "";
      const selectedTemplate = await fetchTemplatesById(tempCode);
      setTable(InitialTable);
      setstate((prev) => ({
        ...prev,
        tempName,
        tempCode,
        selectedTemplate,
        ModifiedTemplate: selectedTemplate,
        stage: selectedTemplate.stage || [],
        unitOperation: selectedTemplate.unitOperation || [],
        step: selectedTemplate.step || [],
        stageValue: "",
        unitOpValue: "",
        stepValue: "",
      }));
    }
  };
  const onChange = (e, setState) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      ModifiedTemplate: TargetProduct.selectedTemplate,
    }));
    setTable((prev) => ({ ...prev, Rows: [] }));
    if (e.target.name === "stageValue") {
      setFormErrors({ ...formErrors, stageError: "" });
    } else {
      setFormErrors({ ...formErrors, unitError: "" });
    }
  };
  const onFilterData = () => {
    let ColumnsToUse = null;
    let RowsToSet = [];
    const stage = TargetProduct.stage.find(
      (item) => item.stageCode === TargetProduct.stageValue
    );
    if (TargetProduct.tempName === "") {
      setFormErrors({ ...formErrors, CodeError: "Code is Required" });
    }
    if (TargetProduct.DataType === "Stage") {
      ColumnsToUse = Columns.stage;
      RowsToSet = TargetProduct.stage;
    } else if (TargetProduct.DataType === "UnitOperation") {
      if (TargetProduct.stageValue === "") {
        setFormErrors({ ...formErrors, stageError: "Stage code is Required" });
        return;
      }
      const unitOperations = TargetProduct.unitOperation.filter(
        (item) => item.stgLevelNo === stage.stgLevelNo
      );
      ColumnsToUse = Columns.unitOperation;
      RowsToSet = unitOperations;
    } else if (TargetProduct.DataType === "Step") {
      if (TargetProduct.unitOpValue === "") {
        setFormErrors({
          ...formErrors,
          stageError: "Unit operation is Required",
        });
        return;
      }
      if (TargetProduct.stageValue === "") {
        setFormErrors({ ...formErrors, stageError: "Stage code is Required" });
        return;
      }
      const unitOperation = TargetProduct.unitOperation.find(
        (item) => item.mpUnitCode === TargetProduct.unitOpValue
      );
      const steps = TargetProduct.step.filter(
        (item) =>
          item.stgLevelNo === stage.stgLevelNo &&
          item.uoLevelNo === unitOperation.uoLevelNo
      );
      ColumnsToUse = Columns.step;
      RowsToSet = steps;
    }
    setTable({
      Columns: ColumnsToUse,
      Rows: RowsToSet,
    });
  };

  const handleReorder = (reorderedData) => {
    if (propertyMap[TargetProduct.DataType]) {
      const newData = reorderedData.map((item, index) => ({
        ...item,
        [propertyMap[TargetProduct.DataType]]: `${index + 1}`,
      }));
      if (reorderedData.length > 0) {
        setTable((prev) => ({ ...prev, Rows: newData }));
        const ModifiedTemplate = {
          ...TargetProduct.selectedTemplate,
          [MapForModification[TargetProduct.DataType]]: newData,
        };
        setTargetProduct((prev) => ({
          ...prev,
          ModifiedTemplate: ModifiedTemplate,
        }));
      }
    }
  };
  const OnTemplateModification = async () => {
    setloading(true)
    try {
      await handleTemplateModification(TargetProduct.ModifiedTemplate);
      setTable(InitialTable);
      const selectedTemplate = await fetchTemplatesById(TargetProduct.tempCode);
      setTargetProduct((prev) => ({
        ...prev,
        selectedTemplate: selectedTemplate,
        ModifiedTemplate: selectedTemplate,
        stage: selectedTemplate.stage || [],
        unitOperation: selectedTemplate.unitOperation || [],
        step: selectedTemplate.step || [],
      }));
      setloading(false)
      handleSnackbarOpen("success", "Template updated succesfully!");
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured while updating!");
      console.error(response);
    }
  };
  const OnCancel = () => {
    setTargetProduct((prev) => ({
      ...prev,
      ModifiedTemplate: TargetProduct.selectedTemplate,
    }));
    setTable(InitialTable);
    setFormErrors(initialErrors);
  };
  useEffect(() => {
    (async () => {
      await fetchTemplates();
    })();
  }, []);
  return (
    <>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={5.75}>
              <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Template Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomAutoComplete
                    options={TargetProduct.templates.map(
                      (opt) => `${opt.tempCode} | ${opt.tempDesc}`
                    )}
                    onChange={(e) => {
                      onTemplateCode(e, setTargetProduct);
                      setFormErrors((prev) => ({ ...prev, CodeError: "" }));
                    }}
                    value={TargetProduct.tempName}
                    width={"100%"}
                    error={formErrors.CodeError !== ""}
                    helperText={formErrors.CodeError !== "" && formErrors.CodeError}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Changes Required In" />
                </Grid>
                <Grid item xs={8}>
                  <FormControl sx={{ width: "100%", marginRight: "8px" }}>
                    <Select
                      value={TargetProduct.DataType}
                      onChange={(e) => onChange(e, setTargetProduct)}
                      variant="outlined"
                      size="small"
                      name="DataType"
                    >
                      <MenuItem value={"Stage"}>Stage</MenuItem>
                      <MenuItem value={"UnitOperation"}>
                        Unit Operation
                      </MenuItem>
                      <MenuItem value={"Step"}>Step</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {(TargetProduct.DataType === "UnitOperation" ||
                  TargetProduct.DataType === "Step") && (
                    <>
                      <Grid item xs={4}>
                        <CustomInputLabel required label="Select Stage" />
                      </Grid>
                      <Grid item xs={8}>
                        <FormControl
                          sx={{ width: "100%", marginRight: "8px" }}
                          error={formErrors.stageError !== ""}
                        >
                          <Select
                            value={TargetProduct.stageValue}
                            onChange={(e) => onChange(e, setTargetProduct)}
                            variant="outlined"
                            size="small"
                            name="stageValue"
                          >
                            {TargetProduct.stage.map((opt) => (
                              <MenuItem
                                value={opt.stageCode}
                              >{`${opt.stageCode} | ${opt.stageDesc}`}</MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {formErrors.stageError !== "" &&
                              formErrors.stageError}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                {TargetProduct.DataType === "Step" && (
                  <>
                    <Grid item xs={4}>
                      <CustomInputLabel
                        required
                        label="Select Unit Operation"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl
                        sx={{ width: "100%", marginRight: "8px" }}
                        error={formErrors.unitError !== ""}
                      >
                        <Select
                          value={TargetProduct.unitOpValue}
                          onChange={(e) => onChange(e, setTargetProduct)}
                          variant="outlined"
                          size="small"
                          name="unitOpValue"
                        >
                          {TargetProduct.unitOperation.map((opt) => (
                            <MenuItem
                              value={opt.mpUnitCode}
                            >{`${opt.mpUnitCode} | ${opt.mpUnitDesc}`}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {formErrors.unitError !== "" && formErrors.unitError}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={5.75}></Grid>
          </Grid>
        </Box>

        {Table.Rows.length > 0 && (
          <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={12}>
                <CustomInputLabel
                  label={`Change Sequence of 
                ${TargetProduct.DataType === "UnitOperation"
                      ? "Unit Operation"
                      : TargetProduct.DataType
                    }`}
                  sx={{ color: "Blue", marginBottom: 3 }}
                />
                <CustomTableReorder
                  data={Table.Rows}
                  tableHeader={Table.Columns}
                  // onRowSelect={selectedRow}
                  onReorder={handleReorder}
                  showCheckBox={false}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box sx={{ marginTop: 3 }}>
          <Stack spacing={1} direction="row" justifyContent={"flex-start"}>
            {Table.Rows.length < 1 ? (
              <CustomButton
                disabled={loading && loading}
                backgroundColor="#28B463"
                variant="contained"
                startIcon={<Search />}
                onClick={onFilterData}
              >
                Search
              </CustomButton>
            ) : (
              <CustomLoadingButton
                backgroundColor="#28B463"
                variant="contained"
                loading={loading}
                loadingPosition="start"
                startIcon={<Update />}
                onClick={OnTemplateModification}
              >
                Update
              </CustomLoadingButton>
            )}
            <CustomButton
              disabled={loading && loading}
              backgroundColor="#E74C3C"
              variant="contained"
              startIcon={<Close/>}
              onClick={OnCancel}
            >
              Close
            </CustomButton>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
const InitialState = {
  tempName: "",
  selectedTemplate: null,
  ModifiedTemplate: null,
  sectionCode: "",
  templates: [],
  tempCode: "",
  stage: [],
  unitOperation: [],
  step: [],
  stageValue: "",
  unitOpValue: "",
  stepValue: "",
  DataType: "",
};
const Columns = {
  templates: [
    { id: "tempCode", label: "Template Code", field: "tempCode" },
    { id: "tempDesc", label: "Description", field: "tempDesc" },
  ],
  stage: [
    { id: "stgLevelNo", label: "Current Sequence", field: "stgLevelNo" },
    { id: "stageCode", label: "Stage Code", field: "stageCode" },
    { id: "stageDesc", label: "Description", field: "stageDesc" },
  ],
  unitOperation: [
    { id: "uoLevelNo", label: "Current Sequence", field: "uoLevelNo" },
    { id: "mpUnitCode", label: "Unit Operation Code", field: "mpUnitCode" },
    { id: "mpUnitDesc", label: "Description", field: "mpUnitDesc" },
  ],
  step: [
    { id: "stpLevelNo", label: "Current Sequence", field: "stpLevelNo" },
    { id: "stepCode", label: "Step Code", field: "stepCode" },
    { id: "stepDesc", label: "Description", field: "stepDesc" },
  ],
};
const propertyMap = {
  Stage: "stgLevelNo",
  UnitOperation: "uoLevelNo",
  Step: "stpLevelNo",
};
const MapForModification = {
  Stage: "stage",
  UnitOperation: "unitOperation",
  Step: "step",
};
const InitialTable = {
  Rows: [],
  Columns: [],
};
const initialErrors = {
  CodeError: "",
  stageError: "",
  unitError: "",
};
export default TemplateModification;
