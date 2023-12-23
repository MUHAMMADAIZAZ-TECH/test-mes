import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  FormControlLabel,
  FormControl,
  Select,
  Checkbox,
  MenuItem,
  ToggleButton,
} from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomAutoComplete,
  CustomTable,
  CustomButton,
  ActionButtons,
} from "../../../../components";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Add } from "@mui/icons-material";
import api from "../../../../api/api";
import {
  fetchMasterFormula, fetchRawData, fetchTest,
  getOptions, deleteIngrAdjs
} from "./Apis";
import { fetchProducts, fetchTemplates } from "../MasterFormula/Apis";
const regexCode = /^[^\s|]+/;
const regexDesc = /\| (.*)/;

function doesIdExist(arr, obj) {
  return arr.listIngredientAdjustment.some((item) => item.seqNo === obj.seqNo);
}

const initTemp = {
  tctd: "Tests",
  seqNo: "",
  code: "",
  codeDesc: "",
  assignAt: "",
  selectedIngSeq: "",
  selectedIng: "",
  selectedIngDesc: "",
  adjusted: "N",
  unit: "",
  lotNo: "",
  comments: "",
};

const CreateIngredientAdjustment = ({ label }) => {
  const EditMode = label.startsWith("Edit") || false;
  const [loading, setloading] = useState(false);
  const [searchparams, Setsearchparams] = useSearchParams();
  const [ingredientAdjs, setIngredientAdjs] = useState({
    productCode: searchparams.get('prod_id') || "",
    stageCode: searchparams.get('stage_id') || "",
    TempCode: searchparams.get('temp_id') || "",
    sectioncode: searchparams.get('sec_id') || "",
    adjOptCode: "",
    adjOptDesc: "",
    listIngredientAdjustment: [],
    tenantId: "1038",
  });
  const [productCode, setProductCode] = useState([]);
  const [Template, setTemplate] = useState([]);
  const [Stage, setStage] = useState([]);
  const [tempIngredientAdjs, setTempIngredientAdjs] = useState(initTemp);
  const [ingAdjsArr, setIngAdjsArr] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [tests, setTests] = useState([]);
  const [testIngr, setTestIngr] = useState([]);
  const [rawIngr, setRawIngr] = useState([]);
  const [ingrSeq, setIngrSeq] = useState([]);
  const [handleAction, handleSnackbarOpen] = useOutletContext();
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const [masterFormula, setMasterFormula] = useState({});

  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1)
  };

  const onSave = async () => {
    setloading(true)
    try {
      if (ingredientAdjs.id) {
        const res = await api.put(`/IngredientAdjustment/${1}`, ingredientAdjs);
        if (res.status === 200) {
          setloading(false)
          handleSnackbarOpen("success", "Updated successfully!");
          navigate(-1)
        }
      } else {
        const res = await api.post(`/IngredientAdjustment`, ingredientAdjs);
        if (res.status === 201) {
          setloading(false)
          handleSnackbarOpen("success", "Created Successfully!");
          navigate(-1)
        }
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen('error', 'An error occured while on your request')
      console.error(response);
    }
  };

  const onAdd = () => {
    if (!tempIngredientAdjs.seqNo || !tempIngredientAdjs.unit) {
      handleSnackbarOpen("error", "Empty required fields");
    } else {
      if (doesIdExist(ingredientAdjs, tempIngredientAdjs)) {
        handleSnackbarOpen("error", "Sequence number already exists");
      } else {
        const updatedClasses = [...ingredientAdjs.listIngredientAdjustment];
        updatedClasses.push(tempIngredientAdjs);
        setIngredientAdjs({
          ...ingredientAdjs,
          listIngredientAdjustment: updatedClasses,
        });
        setTempIngredientAdjs(initTemp);
      }
    }
  };
  const onEdit = (data) => {
    const filteredArray = ingredientAdjs.listIngredientAdjustment.filter(
      (item) => {
        return JSON.stringify(item) !== JSON.stringify(data);
      }
    );
    setIngredientAdjs({
      ...ingredientAdjs,
      listIngredientAdjustment: filteredArray,
    });
    setTempIngredientAdjs(data);
  };
  const onRemove = (data) => {
    const filteredArray = ingredientAdjs.listIngredientAdjustment.filter(
      (item) => {
        return JSON.stringify(item) !== JSON.stringify(data);
      }
    );
    setIngredientAdjs({
      ...ingredientAdjs,
      listIngredientAdjustment: filteredArray,
    });
  };

  const handleSelect = (event) => {
    setTempIngredientAdjs({
      ...tempIngredientAdjs,
      assignAt: event.target.value,
    });
  };

  const handleToggle = (event, value) => {
    setTempIngredientAdjs({
      ...tempIngredientAdjs,
      tctd: value,
      code: "",
      codeDesc: "",
      selectedIng: "",
      selectedIngDesc: "",
      adjusted: "N",
      selectedIngSeq: "",
      lotNo: "",
    });
    setIngrSeq([]);
  };

  const handleIngrSeqSelect = (event) => {
    setTempIngredientAdjs({
      ...tempIngredientAdjs,
      selectedIngSeq: event.target.value,
    });
  };

  const handleCheckboxChange = (event) => {
    setTempIngredientAdjs({
      ...tempIngredientAdjs,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  const handleOptionOnChange = (value) => {
    const desc = (value?.match(regexDesc) || [null])[1];
    const code = (value?.match(regexCode) || [null])[0];
    setIngredientAdjs({
      ...ingredientAdjs,
      adjOptCode: code,
      adjOptDesc: desc,
    });
  };
  const handleTestRawOnChange = (value) => {
    const desc = (value?.match(regexDesc) || [null])[1];
    const code = (value?.match(regexCode) || [null])[0];
    setTempIngredientAdjs({
      ...tempIngredientAdjs,
      code: code,
      codeDesc: desc,
    });
  };
  const handleOptionInputChange = (value) => {
    if (value) {
      setIngredientAdjs({
        ...ingredientAdjs,
        adjOptCode: value,
      });
    }
  };
  const handleIngrOnChange = (value) => {
    const desc = (value?.match(regexDesc) || [null])[1];
    const code = (value?.match(regexCode) || [null])[0];
    setTempIngredientAdjs({
      ...tempIngredientAdjs,
      selectedIng: code,
      selectedIngDesc: desc,
    });
    const seqNos = getSeqNosByProductCode(
      masterFormula.lstMasterFormulaClasses,
      code
    );
    setIngrSeq(seqNos);
  };
  const handleAutoComplete = (value, name) => {
    if (name === 'TempCode') {
      const selectedTemplate = Template.find((temp) => temp.tempCode === value)
      setStage(selectedTemplate.stage)
      setIngredientAdjs((prev) => ({ ...prev, [name]: value, stageCode: '' }))
    }
    else if (name === 'productCode') {
      const selectedProduct = productCode.find((prod) => prod.prodcode === value)
      setIngredientAdjs((prev) => ({ ...prev, [name]: value, sectioncode: selectedProduct.section.sectionCode }))
    }
    else {
      setIngredientAdjs((prev) => ({ ...prev, [name]: value }))
    }
  }
  useEffect(() => {
    fetchProducts(setProductCode, handleSnackbarOpen);
    fetchTemplates(setTemplate, handleSnackbarOpen)
  }, []);
  useEffect(() => {
    if (ingredientAdjs.productCode &&
      ingredientAdjs.TempCode &&
      ingredientAdjs.stageCode &&
      ingredientAdjs.sectioncode) {
      getOptions(
        ingredientAdjs,
        setIngAdjsArr,
        handleSnackbarOpen
      );

      fetchTest(setTests, handleSnackbarOpen);
      fetchRawData(setRawData, handleSnackbarOpen);

      fetchMasterFormula(
        ingredientAdjs,
        setMasterFormula, setIsDataAvailable,
        handleSnackbarOpen,
        EditMode
      );
    }
  }, [
    ingredientAdjs.productCode,
    ingredientAdjs.TempCode,
    ingredientAdjs.stageCode,
    ingredientAdjs.sectioncode
  ]);
  return (
    <>
      <Box sx={{ flexGrow: 1, paddingX: 3 }}>
        <Grid
          display="flex"
          alignItems="center"
          container
          spacing={2}
          marginBottom={"42px"}
        >
          <Grid item xs={2}>
            <CustomInputLabel label="Product Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={ingredientAdjs.productCode}
              options={(productCode.map((prod) => prod.prodcode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'productCode')
                }
              }}
              disabled={EditMode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Section Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomOutlinedInput
              width={"100%"}
              value={ingredientAdjs.sectioncode}
              disabled={EditMode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Template Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={ingredientAdjs.TempCode}
              options={(Template.length > 0 && Template.map((temp) => temp.tempCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'TempCode')
                }
              }}
              disabled={EditMode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Stage Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"100%"}
              value={ingredientAdjs.stageCode}
              options={(Stage?.length > 0 && Stage.map((stage) => stage.stageCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'stageCode')
                }
              }}
              disabled={EditMode}
            />
          </Grid>
        </Grid>

        {isDataAvailable && (
          <>
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={2}>
                <CustomInputLabel label="Option:" />
              </Grid>
              <Grid item xs={10}>
                <CustomAutoComplete
                  options={ingAdjsArr.map(
                    (opt) => `${opt.adjOptCode} | ${opt.adjOptDesc}`
                  )}
                  value={ingredientAdjs.adjOptCode}
                  inputValue={ingredientAdjs.adjOptCode}
                  onChange={handleOptionOnChange}
                  onInputChange={handleOptionInputChange}
                  width={"100%"}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomInputLabel label="Option Description" />
              </Grid>
              <Grid item xs={10}>
                <CustomOutlinedInput
                  value={ingredientAdjs.adjOptDesc}
                  onChange={(e) =>
                    setIngredientAdjs({
                      ...ingredientAdjs,
                      adjOptDesc: e.target.value,
                    })
                  }
                  width={"100%"}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomInputLabel required label="Sequence Number" />
              </Grid>
              <Grid item xs={1.5}>
                <CustomOutlinedInput
                  value={tempIngredientAdjs.seqNo}
                  onChange={(e) =>
                    setTempIngredientAdjs({
                      ...tempIngredientAdjs,
                      seqNo: e.target.value,
                    })
                  }
                  type={"number"}
                  width={"100%"}
                />
              </Grid>

              <Grid item xs={0.5} />

              <Grid item xs={2}>
                <CustomInputLabel required label="Value Assign At" />
              </Grid>
              <Grid item xs={3}>
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    value={tempIngredientAdjs.assignAt}
                    onChange={handleSelect}
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

              <Grid item xs={1}>
                <CustomInputLabel required label="Unit" />
              </Grid>
              <Grid item xs={1.5}>
                <CustomOutlinedInput
                  value={tempIngredientAdjs.unit}
                  onChange={(e) =>
                    setTempIngredientAdjs({
                      ...tempIngredientAdjs,
                      unit: e.target.value,
                    })
                  }
                  width={"100%"}
                />
              </Grid>

              <Grid item xs={0.5} />
              <Grid item xs={12}>
                <ToggleButtonGroup
                  color="primary"
                  value={tempIngredientAdjs.tctd}
                  exclusive
                  size="small"
                  fullWidth
                  onChange={handleToggle}
                >
                  <ToggleButton value="Tests">Test</ToggleButton>
                  <ToggleButton value="RawData">Raw Data</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {tempIngredientAdjs.tctd === "Tests" && (
                <>
                  <Grid
                    item
                    xs={12}
                    border="1px solid #ccc"
                    borderColor={
                      tempIngredientAdjs.tctd === "Tests" && "lightBlue"
                    }
                    borderRadius={1}
                    padding={2}
                    marginLeft={2}
                    marginTop={2}
                  >
                    <Grid
                      display="flex"
                      alignItems="center"
                      container
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <CustomInputLabel
                          label="Test"
                          sx={{
                            color:
                              tempIngredientAdjs.tctd === "Tests" &&
                              "lightBlue",
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <CustomInputLabel required label="Test Code" />
                      </Grid>
                      <Grid item xs={3}>
                        <CustomAutoComplete
                          value={tempIngredientAdjs.code}
                          options={tests.map(
                            (opt) => `${opt.testcode} | ${opt.testshtdesc}`
                          )}
                          onChange={handleTestRawOnChange}
                          disabled={tempIngredientAdjs.tctd !== "Tests" && true}
                          width={"100%"}
                        />
                      </Grid>

                      <Grid item xs={2} />

                      <Grid item xs={2}>
                        <CustomInputLabel required label="Ingredient" />
                      </Grid>
                      <Grid item xs={3}>
                        <CustomAutoComplete
                          value={tempIngredientAdjs.selectedIng}
                          options={testIngr.map(
                            (opt) =>
                              `${opt.ingProductCode} | ${opt.ingProductDesc}`
                          )}
                          onChange={handleIngrOnChange}
                          disabled={tempIngredientAdjs.tctd !== "Tests" && true}
                          width={"100%"}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <CustomInputLabel required label="Sequence No" />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl sx={{ width: "100%" }}>
                          <Select
                            value={tempIngredientAdjs.selectedIngSeq}
                            onChange={handleIngrSeqSelect}
                            variant="outlined"
                            size="small"
                          >
                            {ingrSeq.map((item) => (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={7} />
                    </Grid>
                  </Grid>
                </>
              )}

              {tempIngredientAdjs.tctd === "RawData" && (
                <>
                  <Grid
                    item
                    xs={12}
                    border="1px solid #ccc"
                    borderColor={
                      tempIngredientAdjs.tctd === "RawData" && "lightBlue"
                    }
                    borderRadius={1}
                    padding={2}
                    marginLeft={2}
                    marginTop={2}
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
                          sx={{
                            color:
                              tempIngredientAdjs.tctd === "RawData" &&
                              "lightBlue",
                          }}
                        />
                      </Grid>
                      {tempIngredientAdjs.tctd === "RawData" &&
                        tempIngredientAdjs.assignAt === "execution" && (
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    tempIngredientAdjs.adjusted === "Y"
                                      ? true
                                      : false
                                  }
                                  onChange={handleCheckboxChange}
                                  name="adjusted"
                                />
                              }
                              label="Move Entered Value To Ingredient Quanity"
                            />
                          </Grid>
                        )}
                      <Grid item xs={2}>
                        <CustomInputLabel required label="Raw Data Code" />
                      </Grid>
                      <Grid item xs={3}>
                        <CustomAutoComplete
                          value={tempIngredientAdjs.code}
                          options={rawData.map(
                            (opt) => `${opt.testDataCode} | ${opt.testDataDesc}`
                          )}
                          onChange={handleTestRawOnChange}
                          width={"100%"}
                          disabled={
                            tempIngredientAdjs.tctd !== "RawData" && true
                          }
                        />
                      </Grid>
                      <Grid item xs={2} />
                      <Grid item xs={2}>
                        <CustomInputLabel required label="Ingrdeient" />
                      </Grid>
                      <Grid item xs={3}>
                        <CustomAutoComplete
                          value={tempIngredientAdjs.selectedIng}
                          options={rawIngr.map(
                            (opt) =>
                              `${opt.ingProductCode} | ${opt.ingProductDesc}`
                          )}
                          onChange={(value) => handleIngrOnChange(value)}
                          width={"100%"}
                          disabled={
                            (tempIngredientAdjs.tctd !== "RawData" && true) ||
                            (tempIngredientAdjs.enableLotNo !== "Y" && true)
                          }
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <CustomInputLabel required label="Sequence No" />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl sx={{ width: "100%" }}>
                          <Select
                            value={tempIngredientAdjs.selectedIngSeq}
                            onChange={handleIngrSeqSelect}
                            variant="outlined"
                            size="small"
                          >
                            {ingrSeq.map((item) => (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {tempIngredientAdjs.tctd === "RawData" &&
                        tempIngredientAdjs.assignAt ===
                        "theoreticalQuantity" && <Grid item xs={7} />}

                      {tempIngredientAdjs.tctd === "RawData" &&
                        tempIngredientAdjs.assignAt === "execution" && (
                          <>
                            <Grid item xs={2} />
                            <Grid item xs={2}>
                              <CustomInputLabel required label="Lot No" />
                            </Grid>
                            <Grid item xs={3}>
                              <CustomOutlinedInput
                                value={tempIngredientAdjs.lotNo}
                                onChange={(e) =>
                                  setTempIngredientAdjs({
                                    ...tempIngredientAdjs,
                                    lotNo: e.target.value,
                                  })
                                }
                                type={"number"}
                                width={"100%"}
                                disabled={
                                  tempIngredientAdjs.adjusted === "Y"
                                    ? false
                                    : true
                                }
                              />
                            </Grid>
                          </>
                        )}
                    </Grid>
                  </Grid>
                </>
              )}

              <Grid item xs={2} marginTop={2}>
                <CustomInputLabel label="Comment" />
              </Grid>
              <Grid item xs={10} marginTop={2}>
                <CustomOutlinedInput
                  value={tempIngredientAdjs.comments}
                  onChange={(e) =>
                    setTempIngredientAdjs({
                      ...tempIngredientAdjs,
                      comments: e.target.value,
                    })
                  }
                  multiline
                  minRows={2}
                  width={"100%"}
                />
              </Grid>

              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  backgroundColor="#3498DB"
                  variant="contained"
                  onClick={onAdd}
                  startIcon={<Add />}
                >
                  Add
                </CustomButton>
              </Grid>

              <Grid item xs={12}>
                <CustomTable
                  data={ingredientAdjs.listIngredientAdjustment}
                  tableHeader={tableHeader}
                  showCheckBox={false}
                  showUpdateButton={true}
                  showDeleteButton={true}
                  onUpdate={onEdit}
                  onDelete={onRemove}
                />
              </Grid>
            </Grid>
            <div className="buttons">
              <ActionButtons
                onClose={onCancel}
                onSubmit={onSave}
                loading={loading}
                action={EditMode}
                onDelete={() => {
                  handleAction("Are you sure you want to Delete", () =>
                    deleteIngrAdjs({ ...ingredientAdjs }, handleSnackbarOpen, setloading)
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

const tableHeader = [
  { id: "seqNo", label: "Seq", field: "seqNo" },
  { id: "tctd", label: "Type", field: "tctd" },
  { id: "code", label: "Code", field: "code" },
  { id: "codeDesc", label: "Description", field: "codeDesc" },
  { id: "assignAt", label: "Value Assign", field: "assignAt" },
  { id: "selectedIngSeq", label: "Slct Ing Seq No", field: "selectedIngSeq" },
  { id: "selectedIng", label: "Slct Ing", field: "selectedIng" },
  { id: "selectedIngDesc", label: "Slct Ing Desc", field: "selectedIngDesc" },
  { id: "adjusted", label: "Adjusted", field: "adjusted" },
  { id: "unit", label: "Unit", field: "unit" },
  { id: "lotNo", label: "Lot No", field: "lotNo" },
  { id: "comments", label: "Comment", field: "comments" },
];

export default CreateIngredientAdjustment;

function ingredientsForRawData(inputArray) {
  const uniqueIngredients = {};

  // Loop through the inputArray
  inputArray?.forEach((item) => {
    const productCode = item.ingProductCode;

    // Check if the productCode is not already in uniqueIngredients
    if (!uniqueIngredients[productCode]) {
      // If not, add the item to uniqueIngredients with 'ingProductDesc' and 'adjustReqd'
      uniqueIngredients[productCode] = {
        ingProductCode: productCode,
        ingProductDesc: item.ingProductDesc,
        adjustReqd: item.adjustReqd,
      };
    }
  });

  // Convert the uniqueIngredients object into an array
  const resultArray = Object.values(uniqueIngredients);

  return resultArray;
}

function ingredientsForTest(inputArray) {
  const uniqueIngredients = {};

  // Loop through the inputArray
  inputArray?.forEach((item) => {
    const productCode = item.ingProductCode;

    // Check if the productCode is not already in uniqueIngredients
    if (!uniqueIngredients[productCode]) {
      // If not, add the item to uniqueIngredients with 'ingProductDesc' and 'adjustReqd'
      if (item.adjustReqd === "Y") {
        uniqueIngredients[productCode] = {
          ingProductCode: productCode,
          ingProductDesc: item.ingProductDesc,
          adjustReqd: item.adjustReqd,
        };
      }
    }
  });

  // Convert the uniqueIngredients object into an array
  const resultArray = Object.values(uniqueIngredients);

  return resultArray;
}

function getSeqNosByProductCode(inputArray, ingProductCode) {
  const seqNos = [];

  // Loop through the inputArray
  inputArray?.forEach((item) => {
    if (item.ingProductCode === ingProductCode) {
      // If the 'ingProductCode' matches, add 'seqNo' to the seqNos array
      seqNos.push(item.seqNo);
    }
  });

  return seqNos;
}
