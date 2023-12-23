import React, { useEffect, useState } from "react";
import { Box, Stack, Grid } from "@mui/material";
import api from "../../../../api/api";
import {
  CustomInputLabel, CustomAutoComplete, CustomButton, CustomLoadingButton,
} from "../../../../components";
import TemplateSectionForPre from "./TemplateSectionFroPre";
import { Close, Save, Search } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
const ValueFromPreviousStep = () => {
  const [loading, setloading] = useState(false);
  const [dataFound, setdataFound] = useState(false);
  const [State, setState] = useState(InitialState);
  const [TargetProduct, setTargetProduct] = useState(SectionState);
  const [SourceProduct, setSourceProduct] = useState(SectionState);
  const [VFPreviousStep, setVFPreviousStep] = useState(ValueFrom);
  const [fieldErrors, setFieldErrors] = useState(InitialErrors);
  const [SfieldErrors, setSfieldErrors] = useState(InitialErrors);
  const [handleAction,handleSnackbarOpen] = useOutletContext();

  async function fetchTemplates() {
    try {
      const response = await api.get("/Template");
      if (response.data) {
        setState((prev) => ({
          ...prev,
          templates: response.data
        }))
      }
    } catch ({ response }) {
      handleSnackbarOpen('error', "An error occured while fetching templates")
      console.error(response);
    }
  }
  async function fetchdatabyStepCode(stepCode) {
    try {
      const { data } = await api.get(`/Step/${stepCode}`);
      if (data) {
        setState((prev) => ({
          ...prev,
          RawData: data.rawData,
          Tests: data.tests,
          RawDataValue: "",
          TestCodeValue: ""
        }))
      }
    } catch ({ response }) {
      handleSnackbarOpen('error', "An error occured while fetching step")
      console.error(response);
    }
  }
  async function sendTarget() {
    try {
      const { data, status } = await api.get(`/TempCode/${State.tempCode}/Stage/${g(TargetProduct.stageValue)}/UnitOperation/${g(TargetProduct.unitOpValue)}/Step/${g(TargetProduct.stepValue)}/${TargetProduct.DataType}/${g(TargetProduct.RawDataValue)}/ValueFromPreviousStep`);
      if (status === 200) {
        setSourceProduct((prev) => ({
          ...prev,
          id: data.id,
          stageValue: `${data.stageCodeFr} | ${data.stageDescFr}`,
          unitOpValue: `${data.unitCodeFr} | ${data.unitDescFr}`,
          stepValue: `${data.stepCodeFr} | ${data.stepDescFr}`,
          RawDataValue: `${data.codeFr} | ${data.codeDescFr}` || '',
          TestCodeValue: `${data.codeFr} | ${data.codeDescFr}` || '',
          DataType: data.testOrRawDataFr,
        }))
        setVFPreviousStep(data)
        setdataFound(true)
      }
    } catch ({ response }) {
      if (response.status === 404) {
        setdataFound(true)
        setSourceProduct(SectionState)
      }
      else {
        handleSnackbarOpen("error", "An error occured while fetching value");
      }
      console.error(response);
    }
  }
  const onTemplateCode = (tempName) => {
    const values = tempName?.split(' | ');
    if (tempName !== undefined && tempName !== null) {
      const tempCode = values[0] || '';
      const selectedTemplate = State.templates.find((tem) => tem.tempCode === tempCode)
      setState({
        ...State,
        tempName,
        tempCode,
        selectedTemplate,
        stage: selectedTemplate.stage,
        unitOperation: selectedTemplate.unitOperation,
        step: selectedTemplate.step,
        RawData: [],
        Tests: []
      })
      setFieldErrors((prevErrors) => ({ ...prevErrors, tempName: "" }));
      setTargetProduct(SectionState)
      setSourceProduct(SectionState)
    }
  }
  const onChangeAutoComplete = (property, value, setState, seterrors) => {
    let StepCode = value?.split(' | ');
    if (value) {
      setState((prev) => ({
        ...prev,
        [property]: value,
      }));
      seterrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
      if (property === 'stepValue') {
        fetchdatabyStepCode(StepCode[0])
      }
    }
  };
  const onChange = (e, setState, seterrors) => {
    seterrors((prevErrors) => ({ ...prevErrors, DataType: "" }));
    setState((prev) => ({ ...prev, DataType: e.target.value }))
  }
  const onSubmit = () => {
    const newErrors = {
      ...fieldErrors,
      tempName: State.tempName === "" ? "Template Code is required" : "",
      stageValue: TargetProduct.stageValue === "" ? "Stage is required" : "",
      unitOpValue: TargetProduct.unitOpValue === "" ? "Unit Operation is required" : "",
      stepValue: TargetProduct.stepValue === "" ? "Step is required" : "",
      DataType: TargetProduct.DataType === "" ? "Data Type is required" : "",
      RawDataValue: TargetProduct.RawDataValue === "" ? "Raw Data Value is required" : "",
    };
    setFieldErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      sendTarget();
    }
  };

  const onClose = () => {
    setdataFound(false);
    setFieldErrors(InitialErrors)
    setSourceProduct(SectionState)
  }
  const onDelete = async () => {
    try {
      const response = await api.delete(`/TempCode/${State.tempCode}/Stage/${g(TargetProduct.stageValue)}/UnitOperation/${g(TargetProduct.unitOpValue)}/Step/${g(TargetProduct.stepValue)}/${TargetProduct.DataType}/${g(TargetProduct.RawDataValue)}/ValueFromPreviousStep`);
      if (response.status === 204) {
        handleSnackbarOpen("success", "Value from previous step deleted succesfully!");
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  }
  const UpdateValue = async () => {
    setloading(true)
    try {
      const body = {
        ...VFPreviousStep,
        stageCodeTo: g(TargetProduct.stageValue),
        unitCodeTo: g(TargetProduct.unitOpValue),
        stepCodeTo: g(TargetProduct.stepValue),
        testOrRawData: TargetProduct.DataType,
        codeTo: TargetProduct.DataType === 'RawData' ? g(TargetProduct.RawDataValue) : g(TargetProduct.TestCodeValue),
        stageCodeFr: g(SourceProduct.stageValue),
        unitCodeFr: g(SourceProduct.unitOpValue),
        stepCodeFr: g(SourceProduct.stepValue),
        stageDescFr: SourceProduct.stageValue?.split(' | ')[1],
        unitDescFr: SourceProduct.unitOpValue?.split(' | ')[1],
        stepDescFr: SourceProduct.stepValue?.split(' | ')[1],
        testOrRawDataFr: SourceProduct.DataType,
        codeFr: SourceProduct.DataType === 'RawData' ? g(SourceProduct.RawDataValue) : g(SourceProduct.TestCodeValue),
        tenantId: "1038",
      }
      const response = await api.put(`/TempCode/${State.tempCode}/Stage/${g(TargetProduct.stageValue)}/UnitOperation/${g(TargetProduct.unitOpValue)}/Step/${g(TargetProduct.stepValue)}/${TargetProduct.DataType}/${g(TargetProduct.RawDataValue)}/ValueFromPreviousStep`,
        body);
      if (response.status === 200) {
        setloading(false)
        handleSnackbarOpen("success", "Value from previous step updated succesfully!");
        onClose();
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured while updating");
      console.error(response);
    }
  }
  const onSave = async () => {
    const newErrors = {
      ...SfieldErrors,
      stageValue: SourceProduct.stageValue === "" ? "Stage is required" : "",
      unitOpValue: SourceProduct.unitOpValue === "" ? "Unit Operation is required" : "",
      stepValue: SourceProduct.stepValue === "" ? "Step is required" : "",
      DataType: SourceProduct.DataType === "" ? "Data Type is required" : "",
      RawDataValue: SourceProduct.RawDataValue === "" ? "Raw Data Value is required" : "",
    };
    setSfieldErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      if (SourceProduct.id) {
        UpdateValue();
      } else {
        CreateValue();
      }
    }
  }
  const CreateValue = async () => {
    setloading(true)
    try {
      const body = {
        templateCode: State.tempCode,
        stageCodeTo: g(TargetProduct.stageValue),
        unitCodeTo: g(TargetProduct.unitOpValue),
        stepCodeTo: g(TargetProduct.stepValue),
        testOrRawData: TargetProduct.DataType,
        codeTo: TargetProduct.DataType === 'RawData' ? g(TargetProduct.RawDataValue) : g(TargetProduct.TestCodeValue),
        stageCodeFr: g(SourceProduct.stageValue),
        unitCodeFr: g(SourceProduct.unitOpValue),
        stepCodeFr: g(SourceProduct.stepValue),
        stageDescFr: SourceProduct.stageValue?.split(' | ')[1],
        unitDescFr: SourceProduct.unitOpValue?.split(' | ')[1],
        stepDescFr: SourceProduct.stepValue?.split(' | ')[1],
        testOrRawDataFr: SourceProduct.DataType,
        codeFr: SourceProduct.DataType === 'RawData' ? g(SourceProduct.RawDataValue) : g(SourceProduct.TestCodeValue),
        tenantId: "1038",
      }
      const response = await api.post(`/TempCode/${State.tempCode}/Stage/${g(TargetProduct.stageValue)}/UnitOperation/${g(TargetProduct.unitOpValue)}/Step/${g(TargetProduct.stepValue)}/${TargetProduct.DataType}/ValueFromPreviousStep`,
        body);
      if (response.status === 201) {
        setloading(false)
        handleSnackbarOpen("success", "Value from previous step created succesfully!");
        onClose();
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured while updating");
      console.error(response);
    }
  }
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
            <Grid item xs={6}>
              <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Template Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomAutoComplete
                    options={State.templates.map(
                      (opt) => `${opt.tempCode} | ${opt.tempDesc}`
                    )}
                    onChange={(value) => onTemplateCode(value)}
                    value={State.tempName}
                    width={"100%"}
                    error={fieldErrors.tempName !== ""}
                    disabled={dataFound}
                    helperText={fieldErrors && fieldErrors.tempName}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={12}>
              <TemplateSectionForPre
                label={"Target"}
                SectionState={TargetProduct}
                onChangeAutoComplete={(prop, value, state) => onChangeAutoComplete(prop, value, state, setFieldErrors)}
                setSectionState={setTargetProduct}
                onDataTypeChange={(e, state) => onChange(e, state, setFieldErrors)}
                stateData={State} // Pass your state data here
                fieldErrors={fieldErrors}
                disabled={dataFound}
              />
            </Grid>
            {dataFound && <Grid item xs={12}>
              <TemplateSectionForPre
                label={"Source"}
                SectionState={SourceProduct}
                onChangeAutoComplete={(prop, value, state) => onChangeAutoComplete(prop, value, state, setSfieldErrors)}
                setSectionState={setSourceProduct}
                onDataTypeChange={(e, state) => onChange(e, state, setSfieldErrors)}
                stateData={State} // Pass your state data here
                fieldErrors={SfieldErrors}
              />
            </Grid>}
          </Grid>
        </Box>
        <Box sx={{ marginTop: 3 }}>
          <Stack spacing={1} direction="row" justifyContent={'flex-start'}>
            {!dataFound ? <CustomButton
              disabled={loading && loading}
              backgroundColor="#28B463"
              variant="contained"
              onClick={onSubmit}
              startIcon={<Search />}
            >
              Search
            </CustomButton> : <>
              <CustomLoadingButton
                backgroundColor="#28B463"
                loading={loading}
                loadingPosition={'start'}
                startIcon={<Save />}
                variant="contained"
                onClick={onSave}
              >
                Save
              </CustomLoadingButton>
              <CustomButton
                disabled={loading && loading}
                backgroundColor="#E74C3C"
                variant="contained"
                onClick={() => {
                  handleAction("Are you sure you want to Delete", () =>
                    onDelete()
                  );
                }}
              >
                Delete
              </CustomButton></>}
            <CustomButton
              disabled={loading && loading}
              backgroundColor="#E74C3C"
              variant="contained"
              startIcon={<Close/>}
              onClick={onClose}
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
  templates: [],
  tempCode: "",
  stage: [],
  unitOperation: [],
  step: [],
  RawData: [],
  Tests: [],
}
const SectionState = {
  DataType: "",
  stageValue: "",
  unitOpValue: "",
  stepValue: "",
  RawDataValue: "",
  TestCodeValue: "",
}
const InitialErrors = {
  tempName: "",
  stageValue: "",
  unitOpValue: "",
  stepValue: "",
  DataType: "",
  RawDataValue: "",
}
const ValueFrom = {
  id: "",
  templateCode: "",
  stageCodeTo: "",
  unitCodeTo: "",
  stepCodeTo: "",
  testOrRawData: "",
  codeTo: "",
  stageCodeFr: "",
  unitCodeFr: "",
  stepCodeFr: "",
  stageDescFr: "",
  unitDescFr: "",
  stepDescFr: "",
  testOrRawDataFr: "",
  codeFr: "",
  codeDescFr: "",
  tenantId: "",
  valuefromprevpk: "",
  lastUser: "",
  lastUpdate: "",
  createdBy: "",
  createdOn: "",
  _etag: "",
  isdeleted: false
}
const g = (value) => {
  let values = value?.split(' | ');
  return values[0]
}
export default ValueFromPreviousStep;
