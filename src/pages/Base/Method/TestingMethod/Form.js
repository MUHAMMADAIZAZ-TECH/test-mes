import React, { useEffect, useState } from "react";
import {
  Grid, Checkbox,
  FormControlLabel, FormControl,
  MenuItem, FormHelperText, Select,
} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,
  OperatorsAndFunctionsButtons, CustomTable,
  CustomButton,
  ActionButtons
} from "../../../../components";
import {
  createMethod, updateMethod, initMethod,
  initialErrors, fetchMethod, fetchRawData, fetchTests,
  buttons, tableHeaderRawData, tableHeaderTests, methodTypes, fetchData,
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const AreaForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [rawDataInput, setRawDataInput] = useState("");
  const [rawData, setRawData] = useState([]);
  const [testInput, setTestInput] = useState("");
  const [tests, setTests] = useState([]);
  const [method, setMethod] = useState(initMethod);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: method.methodID === "" ? "Code is Required" : "",
      descError: method.methodDesc === "" ? "Description is required" : "",
      forBaseError: method.valueType === "" ? "Type is required" : "",
      formulaError: method.formula === "" ? "Formula is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: method, handleSnackbarOpen, navigate }
      if (method.methodpk) {
        updateMethod(body, setConfig)
      }
      else {
        createMethod(body, setConfig)
      }
    }
  };
  const handleMethodFilterChange = (event) => {
    setErrors((prev) => ({ ...prev, forBaseError: "", }));
    const selectedValue = event.target.value;
    setMethod({
      ...method,
      valueType: selectedValue,
      formulaBase: selectedValue === 'dateTime' || selectedValue === 'alphanumeric' ? 'N' : 'Y'
    });
  };

  const handleCheckboxChange = (event) => {
    setMethod({
      ...method,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };
  function addToFormula(data) {
    if (data.testDataCode) {
      appendFormula(`&${data.testDataCode}`);
    }
    if (data.testcode) {
      appendFormula(`!${data.testcode}`);
    }
  }

  const appendFormula = (value) => {
    setMethod((prev) => ({
      ...prev,
      formula: prev.formula + value
    }));
  };
  useEffect(() => {
    fetchRawData(setRawData, rawDataInput, handleSnackbarOpen);
    fetchTests(setTests, testInput, handleSnackbarOpen)
  }, []);
  useEffect(() => {
    if (id) {
      fetchData(id, setMethod, setConfig, handleSnackbarOpen, 'TestingMethod')
    }
  }, [id])
  return (
    <Grid container padding={2}>
      <Grid item xs={12}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={1.5}>
            <CustomInputLabel required label="Method Code" />
          </Grid>
          <Grid item xs={10.5}>
            <CustomOutlinedInput
              value={method.methodID}
              onChange={(e) => {
                setMethod({ ...method, methodID: e.target.value.toUpperCase() })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              disabled={label.startsWith("Edit")}
              width="15%"
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={1.5}>
            <CustomInputLabel required label="Description" />
          </Grid>
          <Grid
            item
            xs={10.5}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
          >
            <CustomOutlinedInput
              value={method.methodDesc}
              onChange={(e) => {
                setMethod({
                  ...method,
                  methodDesc: e.target.value,
                })
                setErrors((prev) => ({ ...prev, descError: "", }));
              }}
              width={"50%"}
              error={errors.descError !== ""}
              helperText={errors.descError !== "" && errors.descError}
            />
            <FormControl
              sx={{
                width: "25%",
                marginLeft: "12px",
                marginRight: "12px",
              }}
              error={errors.forBaseError !== ''}
            >
              <Select
                value={method.valueType}
                onChange={handleMethodFilterChange}
                variant="outlined"
                size="small"
              >
                {methodTypes.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.forBaseError !== '' && errors.forBaseError}</FormHelperText>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={method.formulaBase === "Y" ? true : false}
                  onChange={handleCheckboxChange}
                  name="formulaBase"
                  disabled
                />
              }
              label="Formula Base"
            />
          </Grid>

          <Grid item xs={1.5} marginTop={5} marginBottom={5}>
            <CustomInputLabel label="Test Data" />
          </Grid>
          <Grid
            item
            xs={2.5}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
            marginTop={5}
            marginBottom={5}
          >
            <CustomOutlinedInput
              value={rawDataInput}
              onChange={(e) => setRawDataInput(e.target.value)}
              width={"100%"}
            />
            <CustomButton
              backgroundColor="#3498DB"
              variant="contained"
              onClick={() => fetchRawData(setRawData, rawDataInput)}
              sx={{ marginLeft: "5px" }}
            >
              Find
            </CustomButton>
          </Grid>

          <Grid item xs={1.5} marginTop={5} marginBottom={5}>
            <CustomInputLabel label="Test" />
          </Grid>
          <Grid
            item
            xs={2.5}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
            marginTop={5}
            marginBottom={5}
          >
            <CustomOutlinedInput
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              width={"100%"}
            />
            <CustomButton
              backgroundColor="#3498DB"
              variant="contained"
              onClick={() => fetchTests(setTests, testInput)}
              sx={{ marginLeft: "5px" }}
            >
              Find
            </CustomButton>
          </Grid>

          <Grid item xs={4} marginTop={5} />

          <Grid item xs={4} alignSelf={"flex-start"}>
            <CustomInputLabel
              label="Test Data"
              sx={{ marginBottom: "5px" }}
            />
            <CustomTable
              data={rawData}
              tableHeader={tableHeaderRawData}
              showCheckBox={false}
              showAddButton={true}
              onAdd={addToFormula}
              containerStyles={{ maxHeight: "400px", overflowY: "auto" }}
            />
          </Grid>
          <Grid item xs={4} alignSelf={"flex-start"}>
            <CustomInputLabel
              label="Tests"
              sx={{ marginBottom: "5px" }}
            />
            <CustomTable
              data={tests}
              tableHeader={tableHeaderTests}
              showCheckBox={false}
              showAddButton={true}
              onAdd={addToFormula}
              containerStyles={{ maxHeight: "400px", overflowY: "auto" }}
            />
          </Grid>
          <Grid item xs={4} alignSelf={"flex-start"}>
            <CustomInputLabel label="Operators & Functions" />
            <OperatorsAndFunctionsButtons appendFormula={appendFormula} buttons={buttons} />
          </Grid>
          <Grid item xs={1.5}>
            <CustomInputLabel required label="Formula" />
          </Grid>
          <Grid item xs={10.5}>
            <CustomOutlinedInput
              value={method.formula}
              onChange={(e) => {
                setMethod((prev) => ({
                  ...prev,
                  formula: e.target.value
                }))
                setErrors((prev) => ({ ...prev, formulaError: "", }));
              }}
              width={"100%"}
              multiline
              minRows={3}
              error={errors.formulaError !== ''}
              helperText={errors.formulaError !== '' && errors.formulaError}
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


export default AreaForm;
