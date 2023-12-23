import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Checkbox } from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomAutoComplete,
  CustomTable,
  CustomButton,
  ActionButtons,
} from "../../../../components";
import { useSearchParams, useNavigate, useOutletContext } from "react-router-dom";
import { Add } from "@mui/icons-material";
import api from "../../../../api/api";
import { fetchSections, fetchProducts, fetchTemplates } from "./Apis";
const regex = /^[^\s|]+/;

function doesIdExist(arr, obj) {
  return arr.lstMasterFormulaClasses.some((item) => item.seqNo === obj.seqNo);
}

const initTemp = {
  ingProductCode: "",
  seqNo: "",
  perStdQtyReqd: "N",
  qtyPerStdKg: "",
  qtyPerStdG: "",
  qtyPerStdMg: "",
  wwReqd: "N",
  adjustReqd: "N",
  lotBreakable: "N",
  reqdOnPharmSh: "N",
  reqdOnMstrFor: "N",
  forInfo: "N",
  testingStandard: "",
  ingComments: "",
  ingSectionCode: "",
};

const CreateMasterFormula = ({ label }) => {
  const EditMode = label.startsWith("Edit") || false;
  const [searchparams, Setsearchparams] = useSearchParams();
  const [masterFormula, setMasterFormula] = useState({
    tempCode: searchparams.get('temp_id') || "",
    sectionCode: searchparams.get('sec_id') || "",
    productCode: searchparams.get('prod_id') || "",
    stageCode: searchparams.get('stage_id') || "",
    stdQty: "",
    comments: "",
    lstMasterFormulaClasses: [],
    tenantId: "1038",
  });
  const [tempMasterForm, setTempMasterForm] = useState(initTemp);
  const [loading, setloading] = useState(false);

  const [sectionCode, setSectionCode] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [Template, setTemplate] = useState([]);
  const [Stage, setStage] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const [handleAction, handleSnackbarOpen] = useOutletContext();
  useEffect(() => {
    if (masterFormula.productCode && masterFormula.tempCode && masterFormula.stageCode && masterFormula.sectionCode) {
      getMasterFormula();
    }
  }, [
    masterFormula.productCode,
    masterFormula.tempCode,
    masterFormula.stageCode,
    masterFormula.sectionCode
  ]);
  useEffect(() => {
    fetchSections(setSectionCode, handleSnackbarOpen);
    fetchProducts(setProductCode, handleSnackbarOpen);
    fetchTemplates(setTemplate, handleSnackbarOpen)
  }, [])
  const getMasterFormula = async () => {
    try {
      const url = `/MasterFormula/${masterFormula.sectionCode}/${masterFormula.productCode}/${masterFormula.tempCode}/${masterFormula.stageCode}`
      const response = await api.get(url);
      if (response.data) {
        setMasterFormula(response.data);
        setIsDataAvailable(true);
      }
    } catch ({ response }) {
      response.status === 404 && !EditMode ? setIsDataAvailable(true) : (
        handleSnackbarOpen("error", "An error occured while fetching master formula")
      )
      console.error(response);
    }
  };

  const handleCheckboxChange = (event) => {
    setTempMasterForm({
      ...tempMasterForm,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  const onAdd = () => {
    if (
      !masterFormula.stdQty ||
      !tempMasterForm.seqNo ||
      !tempMasterForm.ingProductCode ||
      !tempMasterForm.ingSectionCode
    ) {
      handleSnackbarOpen("error", "Empty required fields");
    } else {
      if (doesIdExist(masterFormula, tempMasterForm)) {
        handleSnackbarOpen("error", "Formula already exists");
      } else {
        const updatedClasses = [...masterFormula.lstMasterFormulaClasses];
        const obj = tempMasterForm;
        obj.ingSectionCode = (tempMasterForm.ingSectionCode?.match(regex) || [
          null,
        ])[0];
        obj.ingProductCode = (tempMasterForm.ingProductCode?.match(regex) || [
          null,
        ])[0];

        updatedClasses.push(obj);

        setMasterFormula({
          ...masterFormula,
          lstMasterFormulaClasses: updatedClasses,
        });
        setTempMasterForm(initTemp);
      }
    }
  };

  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1)
  };

  const onSave = async () => {
    setloading(true)
    try {
      if (masterFormula.id) {
        const res = await api.put(`/MasterFormula/1`, masterFormula);
        if (res.status === 200) {
          setloading(false)
          handleSnackbarOpen("success", "Updated successfully!");
        }
      } else {
        const res = await api.post(`/MasterFormula`, masterFormula);
        if (res.status === 201) {
          setloading(false)
          handleSnackbarOpen("success", "Created successfully!");
          getMasterFormula();
        }
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured on your request");
      console.error(response);
    }
  };

  const onEdit = (data) => {
    const filteredArray = masterFormula.lstMasterFormulaClasses.filter(
      (item) => {
        return JSON.stringify(item) !== JSON.stringify(data);
      }
    );
    setMasterFormula({
      ...masterFormula,
      lstMasterFormulaClasses: filteredArray,
    });
    setTempMasterForm(data);
  };
  const onRemove = (data) => {
    const filteredArray = masterFormula.lstMasterFormulaClasses.filter(
      (item) => {
        return JSON.stringify(item) !== JSON.stringify(data);
      }
    );
    setMasterFormula({
      ...masterFormula,
      lstMasterFormulaClasses: filteredArray,
    });
  };

  const deleteMasterFormula = async () => {
    setloading(true)
    try {
      const url = `/MasterFormula/${masterFormula.sectionCode}/${masterFormula.productCode}/${masterFormula.tempCode}/${masterFormula.stageCode}`
      const response = await api.get(url);
      if (response.data.lstMasterFormulaClasses.length() > 0) {
        await api.delete(url);
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured while deleting");
      console.error(response);
    }
  };

  const handlePrint = () => {
    let printContents = document.getElementById('masterformula').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }
  const handleAutoComplete = (value, name) => {
    if (name === 'tempCode') {
      const selectedTemplate = Template.find((temp) => temp.tempCode === value)
      setStage(selectedTemplate.stage)
      setMasterFormula((prev) => ({ ...prev, [name]: value, stageCode: '' }))
    }
    else if (name === 'productCode') {
      const selectedProduct = productCode.find((prod) => prod.prodcode === value)
      setMasterFormula((prev) => ({ ...prev, [name]: value, sectionCode: selectedProduct.section.sectionCode }))
    }
    else {
      setMasterFormula((prev) => ({ ...prev, [name]: value }))
    }
  }
  return (
    <div id="masterformula">
      <Box sx={{ flexGrow: 1, paddingX: 3 }}>
        <Grid
          display="flex"
          alignItems="center"
          container
          spacing={2}
          marginBottom={4}
        >
          <Grid item xs={2}>
            <CustomInputLabel label="Product Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={masterFormula.productCode}
              options={productCode.map((prod) => prod.prodcode) || []}
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
              value={masterFormula.sectionCode}
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Template Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={masterFormula.tempCode}
              options={(Template.length > 0 && Template.map((temp) => temp.tempCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'tempCode')
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
              value={masterFormula.stageCode}
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
              <Grid item xs={2} marginBottom={2}>
                <CustomInputLabel required label="Standard Quantity" />
              </Grid>
              <Grid item xs={4} marginBottom={2}>
                <CustomOutlinedInput
                  value={masterFormula.stdQty}
                  onChange={(e) =>
                    setMasterFormula({
                      ...masterFormula,
                      stdQty: e.target.value,
                    })
                  }
                  type={"number"}
                  width={"90%"}
                />
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={2}>
                <CustomInputLabel required label="Sequence Number" />
              </Grid>
              <Grid item xs={4}>
                <CustomOutlinedInput
                  value={tempMasterForm.seqNo}
                  onChange={(e) =>
                    setTempMasterForm({
                      ...tempMasterForm,
                      seqNo: e.target.value,
                    })
                  }
                  width={"90%"}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomInputLabel required label="Ingredient Section Code" />
              </Grid>
              <Grid item xs={4}>
                <CustomAutoComplete
                  value={tempMasterForm.ingSectionCode}
                  options={sectionCode
                    .filter((opt) => opt.applicableForProduct === "N")
                    .map((opt) => `${opt.sectionCode} | ${opt.sectionDesc}`)}
                  onChange={(value) => {
                    setTempMasterForm({
                      ...tempMasterForm,
                      ingSectionCode: value,
                    });
                  }}
                  width={"100%"}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomInputLabel required label="Ingredient Code" />
              </Grid>
              <Grid item xs={4}>
                <CustomAutoComplete
                  value={tempMasterForm.ingProductCode}
                  options={productCode.map(
                    (opt) => `${opt.prodcode} | ${opt.prodshtname}`
                  )}
                  onChange={(value) => {
                    setTempMasterForm({
                      ...tempMasterForm,
                      ingProductCode: value,
                    });
                  }}
                  width={"90%"}
                />
              </Grid>

              <Grid item xs={12}>
                <Grid
                  display="flex"
                  alignItems="flex-start"
                  container
                  spacing={2}
                >
                  <Grid item xs={2.5}>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="Per Std Qty Required" />
                      <Checkbox
                        checked={
                          tempMasterForm.perStdQtyReqd === "Y" ? true : false
                        }
                        onChange={handleCheckboxChange}
                        name="perStdQtyReqd"
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="% w/w Required" />
                      <Checkbox
                        checked={tempMasterForm.wwReqd === "Y" ? true : false}
                        onChange={handleCheckboxChange}
                        name="wwReqd"
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="Adjustment Required" />
                      <Checkbox
                        checked={
                          tempMasterForm.adjustReqd === "Y" ? true : false
                        }
                        onChange={handleCheckboxChange}
                        name="adjustReqd"
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="Lot Breakable" />
                      <Checkbox
                        checked={
                          tempMasterForm.lotBreakable === "Y" ? true : false
                        }
                        onChange={handleCheckboxChange}
                        name="lotBreakable"
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="Just For Information" />
                      <Checkbox
                        checked={tempMasterForm.forInfo === "Y" ? true : false}
                        onChange={handleCheckboxChange}
                        name="forInfo"
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="Show On Weighing Sheet" />
                      <Checkbox
                        checked={
                          tempMasterForm.reqdOnPharmSh === "Y" ? true : false
                        }
                        onChange={handleCheckboxChange}
                        name="reqdOnPharmSh"
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <CustomInputLabel label="Show On Master Formula" />
                      <Checkbox
                        checked={
                          tempMasterForm.reqdOnMstrFor === "Y" ? true : false
                        }
                        onChange={handleCheckboxChange}
                        name="reqdOnMstrFor"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9.5}>
                    <Box
                      display={"flex"}
                      alignItems="center"
                      justifyContent={"space-between"}
                      paddingLeft={2}
                      paddingY={2}
                    >
                      <CustomInputLabel label="Per Std Qty" />
                      <Box display={"flex"} alignItems="center" width={"75%"}>
                        <CustomOutlinedInput
                          value={tempMasterForm.qtyPerStdKg}
                          onChange={(e) =>
                            setTempMasterForm({
                              ...tempMasterForm,
                              qtyPerStdKg: e.target.value,
                            })
                          }
                          type={"number"}
                          width={"15%"}
                        />
                        <CustomInputLabel
                          label="Kg"
                          sx={{ marginLeft: 1, marginRight: 9 }}
                        />
                        <CustomOutlinedInput
                          value={tempMasterForm.qtyPerStdG}
                          onChange={(e) =>
                            setTempMasterForm({
                              ...tempMasterForm,
                              qtyPerStdG: e.target.value,
                            })
                          }
                          type={"number"}
                          width={"15%"}
                        />
                        <CustomInputLabel
                          label="G"
                          sx={{ marginLeft: 1, marginRight: 9 }}
                        />
                        <CustomOutlinedInput
                          value={tempMasterForm.qtyPerStdMg}
                          onChange={(e) =>
                            setTempMasterForm({
                              ...tempMasterForm,
                              qtyPerStdMg: e.target.value,
                            })
                          }
                          type={"number"}
                          width={"15%"}
                        />
                        <CustomInputLabel
                          label="Mg"
                          sx={{ marginLeft: 1, marginRight: 9 }}
                        />
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems="center"
                      justifyContent={"space-between"}
                      paddingLeft={2}
                      paddingY={2}
                    >
                      <CustomInputLabel label="Testing Standard" />
                      <CustomOutlinedInput
                        value={tempMasterForm.testingStandard}
                        onChange={(e) =>
                          setTempMasterForm({
                            ...tempMasterForm,
                            testingStandard: e.target.value,
                          })
                        }
                        width={"75%"}
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems="center"
                      justifyContent={"space-between"}
                      paddingLeft={2}
                      paddingY={2}
                    >
                      <CustomInputLabel label="Comments For Ingredient" />
                      <CustomOutlinedInput
                        value={tempMasterForm.ingComments}
                        onChange={(e) =>
                          setTempMasterForm({
                            ...tempMasterForm,
                            ingComments: e.target.value,
                          })
                        }
                        width={"75%"}
                        minRows={5}
                        multiline
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Typography variant="h5">Ingredient</Typography>
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
                  data={masterFormula.lstMasterFormulaClasses}
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
                handlePrint={handlePrint}
                action={EditMode}
                onDelete={() => {
                  handleAction("Are you sure you want to Delete", () =>
                    deleteMasterFormula()
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

const tableHeader = [
  { id: "seqNo", label: "Seq. No.", field: "seqNo" },
  { id: "ingSectionCode", label: "Section", field: "ingSectionCode" },
  { id: "ingProductCode", label: "Product", field: "ingProductCode" },
  { id: "qtyPerStdKg", label: "Per Std Qty (Kg)", field: "qtyPerStdKg" },
  { id: "qtyPerStdG", label: "Per Std Qty (g)", field: "qtyPerStdG" },
  { id: "qtyPerStdMg", label: "Per Std Qty (Mg)", field: "qtyPerStdMg" },
  { id: "adjustReqd", label: "Adjustable", field: "adjustReqd" },
  { id: "lotBreakable", label: "Lot Beeakable", field: "lotBreakable" },
  { id: "perStdQtyReqd", label: "Per Std Reqd", field: "perStdQtyReqd" },
  { id: "reqdOnPharmSh", label: "Pharm Wgh Sht", field: "reqdOnPharmSh" },
  { id: "reqdOnMstrFor", label: "Master Formula", field: "reqdOnMstrFor" },
  { id: "forInfo", label: "For Info Only", field: "forInfo" },
  {
    id: "testingStandard",
    label: "Testing Standard",
    field: "testingStandard",
  },
  { id: "ingComments", label: "Comments", field: "ingComments" },
];

export default CreateMasterFormula;
