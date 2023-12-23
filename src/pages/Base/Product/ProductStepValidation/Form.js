import React, { useEffect, useState } from "react";
import { Box, Grid, FormControl, Select, MenuItem } from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomAutoComplete,
  CustomButton,
  CustomTable,
  ActionButtons,
} from "../../../../components";
import { Add } from "@mui/icons-material";
import {
  fetchProducts, fetchStep, fetchSteps, initValidation,
  fetchTemplates, createStepVal, updateStepVal, deleteStepVal,
  tableHeaderRawData, tableHeaderTest, tableHeaderValidation
} from "./Apis";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";

function doesIdExistInValidations(arr, obj) {
  return arr?.lstProductLevelStepValidations.some(
    (item) => item.validRuleNo === obj.validRuleNo
  );
}

const ProductStepValidation = ({ label }) => {
  const EditMode = label.startsWith("Edit") || false;
  const [searchparams, Setsearchparams] = useSearchParams();
  const sectionCode = searchparams.get('sec_id') || "";
  const stepCode = searchparams.get('step_code') || "";
  const prodCode = searchparams.get('prod_id') || "";
  const tempCode = searchparams.get('temp_id') || "";
  const navigate = useNavigate()
  const [handleAction, handleSnackbarOpen] = useOutletContext();

  const [loading, setloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [steps, setSteps] = useState([]);
  const [step, setStep] = useState({});
  const [validation, setValidation] = useState(initValidation);
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const [selectedData, setSelectedData] = useState({
    product: {},
    template: {},
    step: {},
  });

  useEffect(() => {
    fetchProducts(setProducts, handleSnackbarOpen);
  }, []);
  useEffect(() => {
    if (EditMode) {
      fetchStep(
        { prodCode, tempCode, stepCode, sectionCode },
        selectedData,
        setSelectedData,
        setIsDataAvailable,
        handleSnackbarOpen,
        setStep,
        EditMode
      );
    }
  }, []);
  const onSave = () => {
    if (step.id) {
      updateStepVal(setloading, selectedData, step, handleSnackbarOpen, onClose);
    } else {
      createStepVal(setloading, selectedData, step, handleSnackbarOpen, onClose);
    }
  };
  const onClose = () => {
    navigate(-1)
  };

  const addRawDataToValidation = (data) => {
    let rawDataCode = `&${data.testDataCode}`;
    setValidation((prevState) => ({
      ...validation,
      formula: prevState.formula
        ? `${prevState.formula + rawDataCode}`
        : rawDataCode,
    }));
  };

  const addTestToValidation = (data) => {
    let testCode = `!${data.testcode}`;
    setValidation((prevState) => ({
      ...validation,
      formula: prevState.formula
        ? `${prevState.formula + testCode} `
        : testCode,
    }));
  };
  const onAddValidation = () => {
    if (
      !validation.validRuleNo ||
      !validation.formula ||
      !validation.operator ||
      !validation.resultValue1
    ) {
      handleSnackbarOpen("error", "Empty required fields");
      return;
    }
    if (validation.operator === "b/w" && !validation.resultValue2) {
      handleSnackbarOpen("error", "Empty required fields");
      return;
    }
    if (doesIdExistInValidations(step, validation)) {
      handleSnackbarOpen("error", "Rule number already exists");
      return;
    }
    const updatedClasses = [...step?.lstProductLevelStepValidations];
    if (validation.operator !== "b/w") {
      const temp = validation;
      temp.resultValue2 = "-";
      updatedClasses.push(temp);
    } else {
      updatedClasses.push(validation);
    }

    setStep({
      ...step,
      lstProductLevelStepValidations: updatedClasses,
    });
    setValidation(initValidation);
  };

  const onRemoveValidation = (data) => {
    const filteredArray = step?.lstProductLevelStepValidations.filter(
      (item) => {
        return JSON.stringify(item) !== JSON.stringify(data);
      }
    );
    setStep({
      ...step,
      lstProductLevelStepValidations: filteredArray,
    });
  };


  return (
    <>
      <Box sx={{ flexGrow: 1, paddingX: 3 }}>
        <Grid
          display="flex"
          alignItems="center"
          container
          spacing={2}
          marginBottom={3}
        >
          <Grid item xs={1.5}>
            <CustomInputLabel label="Product:" />
          </Grid>
          <Grid item xs={3.5}>
            {EditMode ? <CustomOutlinedInput
              width={"100%"}
              disabled
              value={prodCode}
            /> :
              <CustomAutoComplete
                options={products}
                onChange={(value) => {
                  if (value) {
                    setSelectedData({
                      ...selectedData,
                      product: value,
                    });
                    fetchTemplates(value.prodcode, setTemplates, handleSnackbarOpen);
                  }
                }}
                value={selectedData.product.prodcode}
                width={"100%"}
              />
            }
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={1.5}>
            <CustomInputLabel label="Section:" />
          </Grid>
          <Grid item xs={3.5}>
            <CustomOutlinedInput
              disabled
              width={"100%"}
              value={
                selectedData.product.section && selectedData?.product?.section?.sectionDesc ?
                  `${selectedData.product.section.sectionCode} | ${selectedData?.product?.section?.sectionDesc}`
                  : sectionCode
              }
            />
          </Grid>
          <Grid item xs={1.5}>
            <CustomInputLabel label="Template:" />
          </Grid>
          <Grid item xs={3.5}>
            {EditMode ? <CustomOutlinedInput
              disabled
              width={"100%"}
              value={tempCode}
            /> :
              <CustomAutoComplete
                options={templates}
                onChange={(value) => {
                  if (value) {
                    setSelectedData({
                      ...selectedData,
                      template: value,
                    });
                    fetchSteps(value.templateCode, setSteps, handleSnackbarOpen);
                  }
                }}
                value={selectedData.template.templateCode}
                width={"100%"}
              />
            }
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={1.5}>
            <CustomInputLabel label="Step:" />
          </Grid>
          <Grid item xs={3.5}>
            {EditMode ? <CustomOutlinedInput
              disabled
              width={"100%"}
              value={stepCode}
            /> :
              <CustomAutoComplete
                options={steps}
                onChange={(value) => {
                  if (value) {
                    fetchStep(
                      {
                        prodCode: selectedData?.product?.prodcode,
                        tempCode: selectedData?.template?.templateCode,
                        stepCode: value?.stepCode,
                        sectionCode: selectedData?.product?.section?.sectionCode
                      },
                      selectedData,
                      setSelectedData,
                      setIsDataAvailable,
                      handleSnackbarOpen,
                      setStep,
                      EditMode
                      );
                  }
                }}
                value={selectedData.step.stepCode}
                width={"100%"}
              />
            }
          </Grid>
        </Grid>
        {isDataAvailable && (
          <>
            <Grid display="flex" alignItems="center" container spacing={2}>
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
                        label="Raw Data"
                        sx={{ color: "Blue" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTable
                        data={selectedData.step.rawData}
                        tableHeader={tableHeaderRawData}
                        showCheckBox={false}
                        showAddButton={true}
                        onAdd={addRawDataToValidation}
                        addTooltip={"Add To Validation"}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
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
                      <CustomInputLabel label="Tests" sx={{ color: "Blue" }} />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTable
                        data={selectedData.step.tests}
                        tableHeader={tableHeaderTest}
                        showCheckBox={false}
                        showAddButton={true}
                        onAdd={addTestToValidation}
                        addTooltip={"Add To Validation"}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
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
                            {["=", ">", "<", ">=", "<=", 'b/w'].map((item, i) => <MenuItem key={i} value={item}>{item} </MenuItem>)}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={0.5} />
                      <Grid item xs={1}>
                        <CustomInputLabel
                          label={
                            validation.operator !== "b/w" ? "Value" : "Value 1"
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
                          type={'number'}
                          width={"100%"}
                        />
                      </Grid>
                      <Grid item xs={0.5} />
                      {validation.operator !== "b/w" && <Grid item xs={2} />}
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
                              type={'number'}
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
                        data={step?.lstProductLevelStepValidations}
                        tableHeader={tableHeaderValidation}
                        showCheckBox={false}
                        showDeleteButton={true}
                        onDelete={onRemoveValidation}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <div className="buttons">
              <ActionButtons
                onClose={onClose}
                onSubmit={onSave}
                loading={loading}
                action={EditMode}
                onDelete={() => {
                  handleAction("Are you sure you want to Delete", () =>
                    deleteStepVal(selectedData, handleSnackbarOpen, onClose)
                  );
                }}
              />
            </div>
          </>
        )}
      </Box>
    </>
  );
};


export default ProductStepValidation;
