import React, { useEffect, useState } from "react";
import {
  Grid, Box, Checkbox, FormControl,
  MenuItem, FormControlLabel, Select, FormHelperText,

} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel, CustomButton,
  CustomTable, CustomAutoComplete, TextEditor, ActionButtons
} from "../../../../components";
import { Add } from '@mui/icons-material';
import {
  createStep, updateStep, initStep, initialErrors,
  fetchData, fetchStepCategories, fetchRawData, fetchTests,
  initValidation, initTest, initRawData, doesIdExist, doesIdExistInValidations,
  tableHeaderRawData, tableHeaderTest, tableHeaderValidation
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const StepForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [step, setStep] = useState(initStep);
  const [categories, setCategories] = useState([]);
  const [rawData, setRawData] = useState(initRawData);
  const [rawDataArr, setRawDataArr] = useState([]);
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState(initTest);
  const [validation, setValidation] = useState(initValidation);

  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: step.stepCode === "" ? "Code is required" : "",
      descError: step.stepDesc === "" ? "Description is required" : "",
      commError: step.comments === "" ? "Comment is required" : "",
      catError: step.stepCateCode === "" ? "Category is required" : "",
      detailError: step.stepDetailsHTML === "" ? "Details is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: step, handleSnackbarOpen, navigate }
      if (step.steppk) {
        updateStep(body, setConfig)
      }
      else {
        createStep(body, setConfig)
      }
    }
  };
  const handleCategoryChange = (event) => {
    setErrors((prev) => ({ ...prev, catError: "" }));
    const selectedValue = event.target.value;
    const selectedStepCategory = categories.find(
      (item) => selectedValue === item.stepCateCode
    );
    setStep({
      ...step,
      stepCateCode: selectedValue,
      stepCateDesc: selectedStepCategory.stepCateDesc,
    });
  };
  const handleCheckboxChange = (event) => {
    setStep({
      ...step,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };
  const handleCheckboxChangeRawData = (event) => {
    setRawData({
      ...rawData,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  const handleContentChange = (html) => {
    setErrors((prev) => ({ ...prev, detailError: "" }));
    setStep({
      ...step,
      stepDetailsHTML: html,
    });
  };

  const handleSelectRawData = (event, name) => {
    setRawData({
      ...rawData,
      [name]: event.target.value,
    });
  };

  const onChangeRawDataAutoComplete = (value) => {
    if (value) {
      setRawData({
        ...rawData,
        testDataCode: value.testDataCode,
        testDataDesc: value.testDataDesc,
      });
    }
  };

  const handleSelectTest = (event, name) => {
    setTest({
      ...test,
      [name]: event.target.value,
    });
  };

  const onChangeTestAutoComplete = (value) => {
    if (value) {
      setTest({
        ...test,
        testcode: value.testcode,
        testshtdesc: value.testshtdesc,
      });
    }
  };
  const onAddRawData = () => {
    if (!rawData.seqNo || !rawData.unit) {
      handleSnackbarOpen("error", "Empty required fields", true);
    } else {
      if (doesIdExist(step, rawData, "rawData")) {
        handleSnackbarOpen("error", "Sequence number already exists", true);
      } else {
        const updatedClasses = [...step.rawData];
        updatedClasses.push(rawData);
        setStep({
          ...step,
          rawData: updatedClasses,
        });
        setRawData(initRawData);
      }
    }
  };
  const onEditRawData = (data) => {
    const filteredArray = step.rawData.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setStep({
      ...step,
      rawData: filteredArray,
    });
    setRawData(data);
  };
  const onRemoveRawData = (data) => {
    const filteredArray = step.rawData.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setStep({
      ...step,
      rawData: filteredArray,
    });
  };
  const onAddTest = () => {
    if (!test.seqNo || !test.unit) {
      handleSnackbarOpen("error", "Empty required fields", true);
    } else {
      if (doesIdExist(step, test, "tests")) {
        handleSnackbarOpen("error", "Sequence number already exists", true);
      } else {
        const updatedClasses = [...step.tests];
        updatedClasses.push(test);
        setStep({
          ...step,
          tests: updatedClasses,
        });
        setTest(initTest);
      }
    }
  };
  const onEditTest = (data) => {
    const filteredArray = step.tests.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setStep({
      ...step,
      tests: filteredArray,
    });
    setTest(data);
  };
  const onRemoveTest = (data) => {
    const filteredArray = step.tests.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setStep({
      ...step,
      tests: filteredArray,
    });
  };
  const addRawDataToValidation = (data) => {
    let rawDataCode = `&${data.testDataCode}`;
    setValidation((prevState) => ({
      ...validation,
      formula: `${prevState.formula + rawDataCode}`,
    }));
  };
  const addTestToValidation = (data) => {
    let testCode = `!${data.testcode}`;
    setValidation((prevState) => ({
      ...validation,
      formula: `${prevState.formula + testCode} `,
    }));
  };
  const onAddValidation = () => {
    if (
      !validation.validRuleNo ||
      !validation.formula ||
      !validation.operator ||
      !validation.resultValue1
    ) {
      handleSnackbarOpen("error", "Empty required fields", true);
      return;
    }
    if (validation.operator === "b/w" && !validation.resultValue2) {
      handleSnackbarOpen("error", "Empty required fields", true);
      return;
    }
    if (doesIdExistInValidations(step, validation)) {
      handleSnackbarOpen("error", "Rule number already exists", true);
      return;
    }

    const updatedClasses = [...step.validations];
    if (validation.operator !== "b/w") {
      const temp = validation;
      temp.resultValue2 = "-";
      updatedClasses.push(temp);
    } else {
      updatedClasses.push(validation);
    }

    setStep({
      ...step,
      validations: updatedClasses,
    });
    setValidation(initValidation);
  };
  const onRemoveValidation = (data) => {
    const filteredArray = step.validations.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setStep({
      ...step,
      validations: filteredArray,
    });
  };

  useEffect(() => {
    if (id) {
      fetchData(id, setStep, setConfig, handleSnackbarOpen, 'Step')
    }
  }, [id])
  useEffect(() => {
    fetchStepCategories(setCategories, handleSnackbarOpen);
    fetchRawData(setRawDataArr, handleSnackbarOpen);
    fetchTests(setTests, handleSnackbarOpen);
  }, []);
  const handlePrint = () => {
    let printContents = document.getElementById('printstep').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }
  return (
    <div id="printstep">
      <Grid container padding={2}>
        <Grid item xs={12}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={1.5}>
              <CustomInputLabel required label="step Code" />
            </Grid>
            <Grid item xs={10.5}>
              <CustomOutlinedInput
                value={step.stepCode}
                onChange={(e) => {
                  setStep({ ...step, stepCode: e.target.value.toUpperCase() })
                  setErrors((prev) => ({ ...prev, CodeError: '' }))
                }}
                width="20%"
                disabled={label.startsWith("Edit")}
                error={errors.CodeError !== ''}
                helperText={errors.CodeError !== '' && errors.CodeError}
              />
            </Grid>
            <Grid item xs={1.5}>
              <CustomInputLabel required label="Description" />
            </Grid>
            <Grid item xs={4.5}>
              <CustomOutlinedInput
                value={step.stepDesc}
                onChange={(e) => {
                  setStep({ ...step, stepDesc: e.target.value, })
                  setErrors((prev) => ({ ...prev, descError: '' }))
                }}
                width="100%"
                error={errors.descError !== ''}
                helperText={errors.descError !== '' && errors.descError}
              />
            </Grid>
            <Grid item xs={1.5}>
              <CustomInputLabel required label="Comments" />
            </Grid>
            <Grid item xs={4.5}>
              <CustomOutlinedInput
                value={step.comments}
                onChange={(e) => {
                  setStep({ ...step, comments: e.target.value });
                  setErrors((prev) => ({ ...prev, commError: "" }));
                }}
                width={"100%"}
                error={errors.commError !== ""}
                helperText={
                  errors.commError !== "" && errors.commError
                }
              />
            </Grid>
            <Grid item xs={1.5}>
              <CustomInputLabel required label="Category" />
            </Grid>
            <Grid item xs={4.5} display={"flex"} alignItems={"center"}>
              <FormControl
                sx={{ width: "30%", marginRight: "8px" }}
                error={errors.catError !== ""}
              >
                <Select
                  value={step.stepCateCode}
                  onChange={handleCategoryChange}
                  variant="outlined"
                  size="small"
                >
                  {categories.map((item) => (
                    <MenuItem
                      key={item.stepCateCode}
                      value={item.stepCateCode}
                    >
                      {item.stepCateCode}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.catError !== "" && errors.catError}
                </FormHelperText>
              </FormControl>
              <CustomInputLabel label={step.stepCateDesc} />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step.status === "Y" ? true : false}
                    onChange={handleCheckboxChange}
                    name="status"
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step.canSavePartially === "Y" ? true : false}
                    onChange={handleCheckboxChange}
                    name="canSavePartially"
                  />
                }
                label="Can this step be partially saved"
              />
            </Grid>

            <Grid item xs={1.5} marginY={4}>
              <CustomInputLabel required label="Details" />
            </Grid>
            <Grid item xs={10.5} marginY={4}>
              <FormControl error={errors.detailError !== ""}>
                <TextEditor
                  onContentChange={handleContentChange}
                  value={step.stepDetailsHTML}
                />
                <FormHelperText>
                  {errors.detailError !== "" && errors.detailError}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <CustomInputLabel label="Note" />
            </Grid>
            <Grid item xs={10.5}>
              <CustomOutlinedInput
                value={step.noteRTF}
                onChange={(e) =>
                  setStep({ ...step, noteRTF: e.target.value })
                }
                width={"100%"}
              />
            </Grid>
            <Grid item xs={1.5} />
            <Grid item xs={3.5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step.isReadReqd === "Y" ? true : false}
                    onChange={handleCheckboxChange}
                    name="isReadReqd"
                  />
                }
                label="Raw Data Required"
              />
            </Grid>
            <Grid item xs={3.5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step.isCalcReqd === "Y" ? true : false}
                    onChange={handleCheckboxChange}
                    name="isCalcReqd"
                  />
                }
                label="Calculation (Test) Required"
              />
            </Grid>
            {(step.isReadReqd === "Y" || step.isCalcReqd === "Y") && (
              <Grid item xs={3.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={step.isValidReqd === "Y" ? true : false}
                      onChange={handleCheckboxChange}
                      name="isValidReqd"
                    />
                  }
                  label="Validation Required"
                />
              </Grid>
            )}
            {step.isReadReqd === "Y" && (
              <Grid item xs={12}>
                <Box
                  marginY={1}
                  border="1px solid #ccc"
                  borderRadius={1}
                  padding={3}
                >
                  <Grid
                    display="flex"
                    alignItems="center"
                    container
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <CustomInputLabel
                        required
                        label="Raw Data"
                        sx={{ color: "Blue" }}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="Sequence No." />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomOutlinedInput
                        value={rawData.seqNo}
                        onChange={(e) =>
                          setRawData({
                            ...rawData,
                            seqNo: e.target.value,
                          })
                        }
                        type={"number"}
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={0.5} />
                    <Grid item xs={2}>
                      <CustomInputLabel required label="Assignment" />
                    </Grid>
                    <Grid item xs={2.5}>
                      <FormControl sx={{ width: "100%" }}>
                        <Select
                          value={rawData.assignment}
                          onChange={(e) =>
                            handleSelectRawData(e, "assignment")
                          }
                          variant="outlined"
                          size="small"
                        >
                          <MenuItem key={1} value={"execution"}>
                            Execution
                          </MenuItem>
                          <MenuItem key={2} value={"theoreticalQuantity"}>
                            Theoretical Quantity
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={0.5} />
                    <Grid item xs={2}>
                      <CustomInputLabel required label="Type of Value" />
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl sx={{ width: "100%" }}>
                        <Select
                          value={rawData.valueType}
                          onChange={(e) =>
                            handleSelectRawData(e, "valueType")
                          }
                          variant="outlined"
                          size="small"
                        >
                          <MenuItem key={1} value={"numeric"}>
                            Numeric
                          </MenuItem>
                          <MenuItem key={1} value={"time"}>
                            Time (hh:mm:ss)
                          </MenuItem>
                          <MenuItem key={2} value={"dateTime"}>
                            Date Time
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="Raw Data" />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomAutoComplete
                        options={rawDataArr}
                        onChange={onChangeRawDataAutoComplete}
                        value={rawData.testDataCode}
                        width={"100%"}
                      />
                    </Grid>

                    <Grid item xs={0.25} />

                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="No. of Readings" />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomOutlinedInput
                        value={rawData.noOfReading}
                        onChange={(e) =>
                          setRawData({
                            ...rawData,
                            noOfReading: e.target.value,
                          })
                        }
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <FormControl sx={{ width: "100%" }}>
                        <Select
                          value={rawData.behaviour}
                          onChange={(e) =>
                            handleSelectRawData(e, "behaviour")
                          }
                          variant="outlined"
                          size="small"
                        >
                          <MenuItem key={1} value={"fixed"}>
                            Fixed
                          </MenuItem>
                          <MenuItem key={2} value={"changeableAtExecution"}>
                            Changeable At Execution
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={0.25} />
                    <Grid item xs={1}>
                      <CustomInputLabel required label="Unit" />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomOutlinedInput
                        value={rawData.unit}
                        onChange={(e) =>
                          setRawData({
                            ...rawData,
                            unit: e.target.value,
                          })
                        }
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              rawData.multipleUnit === "Y" ? true : false
                            }
                            onChange={handleCheckboxChangeRawData}
                            name="multipleUnit"
                          />
                        }
                        label="Multiple Units"
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="Comments" />
                    </Grid>
                    <Grid item xs={9.5}>
                      <CustomOutlinedInput
                        value={rawData.comments}
                        onChange={(e) =>
                          setRawData({
                            ...rawData,
                            comments: e.target.value,
                          })
                        }
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomButton
                        backgroundColor="#3498DB"
                        variant="contained"
                        onClick={onAddRawData}
                        startIcon={<Add />}
                      >
                        Add
                      </CustomButton>
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTable
                        data={step.rawData}
                        tableHeader={tableHeaderRawData}
                        showCheckBox={false}
                        showUpdateButton={true}
                        showDeleteButton={true}
                        onUpdate={onEditRawData}
                        onDelete={onRemoveRawData}
                        showAddButton={
                          (step.isReadReqd === "Y" ||
                            step.isCalcReqd === "Y") &&
                          step.isValidReqd === "Y" &&
                          true
                        }
                        onAdd={
                          (step.isReadReqd === "Y" ||
                            step.isCalcReqd === "Y") &&
                          step.isValidReqd === "Y" &&
                          addRawDataToValidation
                        }
                        addTooltip={
                          (step.isReadReqd === "Y" ||
                            step.isCalcReqd === "Y") &&
                          step.isValidReqd === "Y" &&
                          "Add To Validation"
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
            {step.isCalcReqd === "Y" && (
              <Grid item xs={12}>
                <Box
                  marginY={1}
                  border="1px solid #ccc"
                  borderRadius={1}
                  padding={3}
                >
                  <Grid
                    display="flex"
                    alignItems="center"
                    container
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <CustomInputLabel
                        required
                        label="Calculation (Test)"
                        sx={{ color: "Blue" }}
                      />
                    </Grid>

                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="Sequence No." />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomOutlinedInput
                        value={test.seqNo}
                        onChange={(e) =>
                          setTest({
                            ...test,
                            seqNo: e.target.value,
                          })
                        }
                        type={"number"}
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={1.5} />
                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="No. of Readings" />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomOutlinedInput
                        value={test.noOfTimes}
                        onChange={(e) =>
                          setTest({
                            ...test,
                            noOfTimes: e.target.value,
                          })
                        }
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <FormControl sx={{ width: "100%" }}>
                        <Select
                          value={test.behaviour}
                          onChange={(e) => handleSelectTest(e, "behaviour")}
                          variant="outlined"
                          size="small"
                        >
                          <MenuItem key={1} value={"execution"}>
                            Execution
                          </MenuItem>
                          <MenuItem key={2} value={"theoreticalQuantity"}>
                            Theoretical Quantity
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={1}>
                      <CustomInputLabel required label="Unit" />
                    </Grid>
                    <Grid item xs={1}>
                      <CustomOutlinedInput
                        value={test.unit}
                        onChange={(e) =>
                          setTest({
                            ...test,
                            unit: e.target.value,
                          })
                        }
                        width={"100%"}
                      />
                    </Grid>

                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="Test Code" />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomAutoComplete
                        options={tests}
                        onChange={onChangeTestAutoComplete}
                        value={test.testcode}
                        width={"100%"}
                      />
                    </Grid>

                    <Grid item xs={8.5} />

                    <Grid item xs={1.5}>
                      <CustomInputLabel required label="Comments" />
                    </Grid>
                    <Grid item xs={8.5}>
                      <CustomOutlinedInput
                        value={test.comments}
                        onChange={(e) =>
                          setTest({
                            ...test,
                            comments: e.target.value,
                          })
                        }
                        width={"100%"}
                      />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={1}>
                      <CustomButton
                        backgroundColor="#3498DB"
                        variant="contained"
                        onClick={onAddTest}
                        startIcon={<Add />}
                      >
                        Add
                      </CustomButton>
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTable
                        data={step.tests}
                        tableHeader={tableHeaderTest}
                        showCheckBox={false}
                        showUpdateButton={true}
                        showDeleteButton={true}
                        onUpdate={onEditTest}
                        onDelete={onRemoveTest}
                        showAddButton={
                          (step.isReadReqd === "Y" ||
                            step.isCalcReqd === "Y") &&
                          step.isValidReqd === "Y" &&
                          true
                        }
                        onAdd={
                          (step.isReadReqd === "Y" ||
                            step.isCalcReqd === "Y") &&
                          step.isValidReqd === "Y" &&
                          addTestToValidation
                        }
                        addTooltip={
                          (step.isReadReqd === "Y" ||
                            step.isCalcReqd === "Y") &&
                          step.isValidReqd === "Y" &&
                          "Add To Validation"
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
            {(step.isReadReqd === "Y" || step.isCalcReqd === "Y") &&
              step.isValidReqd === "Y" && (
                <Grid item xs={12}>
                  <Box
                    marginY={1}
                    border="1px solid #ccc"
                    borderRadius={1}
                    padding={3}
                  >
                    <Grid
                      display="flex"
                      alignItems="center"
                      container
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <CustomInputLabel
                          required
                          label="Validation"
                          sx={{ color: "Blue" }}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <CustomInputLabel required label="Rule No." />
                      </Grid>
                      <Grid item xs={1}>
                        <CustomOutlinedInput
                          value={validation.validRuleNo}
                          onChange={(e) =>
                            setValidation({
                              ...validation,
                              validRuleNo: e.target.value,
                            })
                          }
                          type={"number"}
                          width={"100%"}
                        />
                      </Grid>
                      <Grid item xs={0.5} />
                      <Grid item xs={1.5}>
                        <CustomInputLabel required label="Formula" />
                      </Grid>
                      <Grid item xs={7.5}>
                        <CustomOutlinedInput
                          value={validation.formula}
                          onChange={(e) => {
                            setValidation({
                              ...validation,
                              formula: e.target.value,
                            });
                          }}
                          width={"100%"}
                          multiline
                          minRows={2}
                        />
                      </Grid>
                      <>
                        <Grid item xs={1.5}>
                          <CustomInputLabel label="Operator" />
                        </Grid>
                        <Grid item xs={1}>
                          <FormControl sx={{ width: "100%" }}>
                            <Select
                              value={validation.operator}
                              onChange={(e) => {
                                setValidation({
                                  ...validation,
                                  operator: e.target.value,
                                });
                              }}
                              variant="outlined"
                              size="small"
                            >
                              <MenuItem key={1} value={"="}>
                                {"="}
                              </MenuItem>
                              <MenuItem key={2} value={">"}>
                                {">"}
                              </MenuItem>
                              <MenuItem key={3} value={"<"}>
                                {"<"}
                              </MenuItem>
                              <MenuItem key={4} value={">="}>
                                {">="}
                              </MenuItem>
                              <MenuItem key={5} value={"<="}>
                                {"<="}
                              </MenuItem>
                              <MenuItem key={6} value={"b/w"}>
                                b/w
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={0.5} />
                        <Grid item xs={1}>
                          <CustomInputLabel
                            label={
                              validation.operator !== "b/w"
                                ? "Value"
                                : "Value 1"
                            }
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <CustomOutlinedInput
                            value={validation.resultValue1}
                            onChange={(e) =>
                              setValidation({
                                ...validation,
                                resultValue1: e.target.value,
                              })
                            }
                            width={"100%"}
                          />
                        </Grid>
                        <Grid item xs={0.5} />
                        {validation.operator !== "b/w" && (
                          <Grid item xs={2} />
                        )}
                        {validation.operator === "b/w" && (
                          <>
                            <Grid item xs={1}>
                              <CustomInputLabel label="value 2" />
                            </Grid>
                            <Grid item xs={1}>
                              <CustomOutlinedInput
                                value={validation.resultValue2}
                                onChange={(e) =>
                                  setValidation({
                                    ...validation,
                                    resultValue2:
                                      validation.operator === "b/w"
                                        ? e.target.value
                                        : "-",
                                  })
                                }
                                width={"100%"}
                              />
                            </Grid>
                          </>
                        )}
                      </>

                      <Grid item xs={1} />
                      <Grid item xs={1}>
                        <CustomButton
                          backgroundColor="#3498DB"
                          variant="contained"
                          onClick={onAddValidation}
                          startIcon={<Add />}
                        >
                          Add
                        </CustomButton>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTable
                          data={step.validations}
                          tableHeader={tableHeaderValidation}
                          showCheckBox={false}
                          showDeleteButton={true}
                          onDelete={onRemoveValidation}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
          </Grid>
          <div className="buttons">
            <ActionButtons
              handlePrint={handlePrint}
              loading={loading}
              onClose={() => navigate(-1)}
              onSubmit={onSubmit}
              action={label.startsWith("Edit") || false}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};


export default StepForm;
