import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomInput,
  CustomAutoComplete,
  ActionButtons,
} from "../../../../components";
import { Delete } from "@mui/icons-material";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import {
  deleteProductVariable, createProductVariable, updateProductVariable,
  fetchProdVar, fetchProducts, fetchStepCtgs, fetchTemplates,
  tableHeaderRawData, tableHeaderVariable
} from "./Apis";
const StepProductVariable = ({ label }) => {
  const navigate = useNavigate();
  const EditMode = label.startsWith("Edit") || false;
  const [searchparams, Setsearchparams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stepCtgs, setStepCtgs] = useState([]);
  const [showRawData, setShowRawData] = useState(true);
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const [prodVar, setProdVar] = useState({
    rawData: [],
    variables: [],
    prodCode: searchparams.get('prod_id') || "",
    tempCode: searchparams.get('temp_id') || "",
    stepCategory: "",
    tenantId: "1038",
  });
  const sectionCode = searchparams.get('sec_id') || "";
  const stepCategory = searchparams.get('step_cat') || "";
  const [loading, setloading] = useState(false);
  const [handleAction, handleSnackbarOpen] = useOutletContext();

  const [selectedData, setSelectedData] = useState({
    product: {},
    template: {},
    stepCtg: {},
  });

  useEffect(() => {
    fetchProducts(setProducts, handleSnackbarOpen);
  }, []);
  useEffect(() => {
    if (EditMode) {
      fetchProdVar({
        prodCode: prodVar.prodCode,
        tempCode: prodVar.tempCode,
        stepCategory: stepCategory,
      },
        setProdVar,
        setIsDataAvailable
      );
    }
  }, []);

  const handleToggle = (event, value) => {
    setShowRawData(value);
  };
  const handleRawDataVal = (e, row) => {
    const value = e.target.value;
    setProdVar((prevProdVar) => ({
      ...prevProdVar,
      rawData: prevProdVar.rawData.map((item) =>
        item === row ? { ...item, testDataValue: value } : item
      ),
    }));
  };
  const handleVariableVal = (e, row) => {
    const value = e.target.value;
    setProdVar((prevProdVar) => ({
      ...prevProdVar,
      variables: prevProdVar.variables.map((item) =>
        item === row ? { ...item, varValue: value } : item
      ),
    }));
  };
  const removeRowFromRawData = (row) => {
    setProdVar((prevProdVar) => ({
      ...prevProdVar,
      rawData: prevProdVar.rawData.filter((item) => item !== row),
    }));
  };
  const removeRowFromVariables = (row) => {
    setProdVar((prevProdVar) => ({
      ...prevProdVar,
      variables: prevProdVar.variables.filter((item) => item !== row),
    }));
  };
  const onSave = () => {
    if (selectedData?.product?.prodcode &&
      selectedData?.template?.templateCode && selectedData?.stepCtg?.stepCateCode) {
      const Body = {
        prodCode: selectedData?.product?.prodcode || prodVar.prodCode,
        tempCode: selectedData?.template?.templateCode || prodVar.tempCode,
        stepCategory: selectedData?.stepCtg?.stepCateCode || stepCategory,
      }
      if (prodVar.id) {
        updateProductVariable(prodVar, Body, setloading, handleSnackbarOpen, onClose);
      } else {
        createProductVariable(prodVar, Body, setloading, handleSnackbarOpen, onClose);
      }
    }
  };
  const handleDelete = () => {
    const Body = {
      prodCode: selectedData?.product?.prodcode || prodVar.prodCode,
      tempCode: selectedData?.template?.templateCode || prodVar.tempCode,
      stepCategory: selectedData?.stepCtg?.stepCateCode || stepCategory,
    }
    deleteProductVariable(Body, handleSnackbarOpen, onClose)
  }
  const onClose = () => {
    navigate(-1)
  };

  const handlePrint = () => {
    let printContents = document.getElementById('printpage').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }
  return (
    <div id="printpage">
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
              value={prodVar.prodCode}
            /> : <CustomAutoComplete
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
              value={selectedData.product.prodcode || ""}
              width={"100%"}
            />}
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
              value={prodVar.tempCode}
            /> :
              <CustomAutoComplete
                options={templates}
                onChange={(value) => {
                  if (value) {
                    setSelectedData({
                      ...selectedData,
                      template: value,
                    });
                    fetchStepCtgs(value.templateCode, setStepCtgs, handleSnackbarOpen);
                  }
                }}
                value={selectedData.template.templateCode || ""}
                width={"100%"}
              />
            }
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={1.5}>
            <CustomInputLabel label="Step Category:" />
          </Grid>
          <Grid item xs={3.5}>
            {EditMode ? <CustomOutlinedInput
              disabled
              width={"100%"}
              value={stepCategory}
            /> :
              <CustomAutoComplete
                options={stepCtgs}
                onChange={(value) => {
                  if (value) {
                    setSelectedData({
                      ...selectedData,
                      stepCtg: value,
                    });
                    fetchProdVar(
                      {
                        prodCode: selectedData.product.prodcode,
                        tempCode: selectedData.template.templateCode,
                        stepCategory: value.stepCateCode,
                      },
                      setProdVar,
                      setIsDataAvailable
                    );
                  }
                }}
                value={selectedData.stepCtg.stepCateCode || ""}
                width={"100%"}
              />
            }
          </Grid>
        </Grid>
        {isDataAvailable && (
          <>
            {" "}
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  color="primary"
                  value={showRawData}
                  exclusive
                  size="small"
                  fullWidth
                  onChange={handleToggle}
                >
                  <ToggleButton value={true}>
                    Show Raw Data in Steps
                  </ToggleButton>
                  <ToggleButton value={false}>
                    Show Variables in Steps
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {showRawData === true && (
                <Grid item xs={12}>
                  <TableContainer sx={{ width: "100%" }} component={Paper}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                        <TableRow>
                          {tableHeaderRawData.map(
                            (column) =>
                              column.field !== "testDataValue" && (
                                <TableCell key={column.id}>
                                  {column.label}
                                </TableCell>
                              )
                          )}
                          <TableCell>Value</TableCell>
                          <TableCell>CLear</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prodVar.rawData.map((row) => (
                          <TableRow key={row.name}>
                            {tableHeaderRawData.map(
                              (column) =>
                                column.field !== "testDataValue" && (
                                  <TableCell
                                    key={column.id}
                                    component="th"
                                    scope="row"
                                  >
                                    {row[column.field]}
                                  </TableCell>
                                )
                            )}
                            <TableCell>
                              <CustomInput
                                value={row.testDataValue}
                                onChange={(e) => handleRawDataVal(e, row)}
                                width={"100%"}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleAction(
                                    "Are you sure you want to Delete",
                                    () => removeRowFromRawData(row)
                                  )
                                }
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
              {showRawData === false && (
                <Grid item xs={12}>
                  <TableContainer sx={{ width: "100%" }} component={Paper}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                        <TableRow>
                          {tableHeaderVariable.map(
                            (column) =>
                              column.field !== "varValue" && (
                                <TableCell key={column.id}>
                                  {column.label}
                                </TableCell>
                              )
                          )}
                          <TableCell>Value</TableCell>
                          <TableCell>CLear</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prodVar.variables.map((row) => (
                          <TableRow key={row.name}>
                            {tableHeaderVariable.map(
                              (column) =>
                                column.field !== "varValue" && (
                                  <TableCell
                                    key={column.id}
                                    component="th"
                                    scope="row"
                                  >
                                    {row[column.field]}
                                  </TableCell>
                                )
                            )}
                            <TableCell>
                              <CustomInput
                                value={row.varValue}
                                onChange={(e) => handleVariableVal(e, row)}
                                width={"100%"}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleAction(
                                    "Are you sure you want to Delete",
                                    () => removeRowFromVariables(row)
                                  )
                                }
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
            <div className="buttons">
              <ActionButtons
                onClose={onClose}
                onSubmit={onSave}
                loading={loading}
                handlePrint={handlePrint}
                action={EditMode}
                onDelete={() => {
                  handleAction("Are you sure you want to Delete", handleDelete
                  );
                }}
              />
            </div>
          </>
        )}
      </Box>
    </div>
  );
};


export default StepProductVariable;
