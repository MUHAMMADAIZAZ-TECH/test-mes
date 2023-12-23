import React, { useEffect, useState } from "react";
import { Box, Grid, FormControlLabel, Checkbox } from "@mui/material";
import {
  CustomTable,
  CustomOutlinedInput,
  CustomButton,
  CustomInputLabel,
  CustomAutoComplete,
  ActionButtons,
} from "../../../../components";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Add } from "@mui/icons-material";
import api from "../../../../api/api";
import { fetchTemplates, fetchProducts } from "../MasterFormula/Apis";
const regexCode = /^[^\s|]+/;
const regexDesc = /\| (.*)/;

function doesIdExist(arr, obj) {
  return arr.basicAreaTypeClasses.some(
    (item) => item.areaTypeCode === obj.areaTypeCode
  );
}

const initTemp = {
  areaTypeCode: "",
  areaTypeDesc: "",
  lcReqd: "",
  lcCode: "",
  lcDesc: "",
};


const AssignAreaTypesToUnitOp = ({ label }) => {
  const [searchparams, Setsearchparams] = useSearchParams();
  const EditMode = label.startsWith("Edit") || false;
  const initAssignAt = {
    productCode: searchparams.get('prod_id') || "",
    sectionCode: searchparams.get('sec_id') || "",
    tempCode: searchparams.get('temp_id') || "",
    mpUnitOpCode: searchparams.get('unit_op') || "",
    basicAreaTypeClasses: [],
    tenantId: "1038",
  };

  const [productCode, setProductCode] = useState([]);
  const [Template, setTemplate] = useState([]);
  const [assignAT, setAssignAT] = useState(initAssignAt);
  const [areaType, setAreaType] = useState(initTemp);
  const [mpUnitOpCode, setmpUnitOpCode] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [areaTypes, setAreaTypes] = useState([]);
  const [lineClrs, setLineClrs] = useState([]);
  const [loading, setloading] = useState(false);
  const [handleAction, handleSnackbarOpen] = useOutletContext();

  useEffect(() => {
    if (assignAT.productCode &&
      assignAT.tempCode &&
      assignAT.sectionCode &&
      assignAT.mpUnitOpCode) {
      fetchAssignAT();
      fetchAreaTypes();
      fetchLineClr();
    }
  }, [assignAT.productCode,
  assignAT.tempCode,
  assignAT.sectionCode,
  assignAT.mpUnitOpCode]);

  const fetchAssignAT = async () => {
    try {
      const response = await api.get(
        `/AssignAreaTypes/${assignAT.sectionCode}/${assignAT.productCode}/${assignAT.tempCode}/${assignAT.mpUnitOpCode}`
      );
      if (response.data) {
        setAssignAT(response.data);
        setIsDataAvailable(true);
      }
    } catch (error) {
      (error.response.status === 404 && !EditMode? setIsDataAvailable(true) : (
        handleSnackbarOpen("error", "An error occured while fetching data")
      ))
      console.error(error);
    }
  };

  const fetchAreaTypes = async () => {
    try {
      const response = await api.get(`/AreaType`);
      if (response.data) {
        setAreaTypes(response.data);
      }
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching area types");
      console.error(response);
    }
  };

  const fetchLineClr = async () => {
    try {
      const response = await api.get("/LineClearance");
      if (response.data) {
        setLineClrs(response.data);
      }
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching line clearance");
      console.error(response);
    }
  };

  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1)
  };

  const deleteAssignAT = async () => {
    try {
      const res = await api.delete(
        `/AssignAreaTypes/${assignAT.sectionCode}/${assignAT.productCode}/${assignAT.tempCode}/${assignAT.mpUnitOpCode}`
      );
      if (res.status === 200) {
        handleSnackbarOpen("success", "Deleted successfully!");
      }
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while Deleting");
      console.error(response);
    }
  };

  const onSave = async () => {
    setloading(true)
    try {
      if (assignAT.id) {
        const res = await api.put(`/AssignAreaTypes/${1}`, assignAT);
        if (res.status === 200) {
          setloading(false)
          handleSnackbarOpen("success", "Updated successfully!");
          navigate(-1)
        }
      } else {
        setloading(true)
        const res = await api.post(`/AssignAreaTypes`, assignAT);
        if (res.status === 201) {
          setloading(false)
          handleSnackbarOpen("success", "Created Successfully!");
          navigate(-1)
        }
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured while creating/updating");
      console.error(response);
    }
  };

  const onAdd = () => {
    if (!areaType.areaTypeCode) {
      handleSnackbarOpen("error", "Empty required fields", true);
    } else {
      if (doesIdExist(assignAT, areaType)) {
        handleSnackbarOpen("error", "This area type code already exists", true);
      } else {
        const updatedClasses = [...assignAT.basicAreaTypeClasses];
        updatedClasses.push(areaType);
        setAssignAT({
          ...assignAT,
          basicAreaTypeClasses: updatedClasses,
        });
        setAreaType(initTemp);
      }
    }
  };

  const onRemove = (data) => {
    const filteredArray = assignAT.basicAreaTypeClasses.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setAssignAT({
      ...assignAT,
      basicAreaTypeClasses: filteredArray,
    });
  };

  const handleCheckboxChange = (event) => {
    setAreaType({
      ...areaType,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  const handleOptionOnChange = (value) => {
    const desc = (value?.match(regexDesc) || [null])[1];
    const code = (value?.match(regexCode) || [null])[0];
    setAreaType({
      ...areaType,
      areaTypeCode: code,
      areaTypeDesc: desc,
    });
  };
  const handleAutoComplete = (value, name) => {
    if (name === 'tempCode') {
      const selectedTemplate = Template.find((temp) => temp.tempCode === value)
      setmpUnitOpCode(selectedTemplate.unitOperation)
      setAssignAT((prev) => ({ ...prev, [name]: value, mpUnitOpCode: '' }))
    }
    else if (name === 'productCode') {
      const selectedProduct = productCode.find((prod) => prod.prodcode === value)
      setAssignAT((prev) => ({ ...prev, [name]: value, sectionCode: selectedProduct.section.sectionCode }))
    }
    else {
      setAssignAT((prev) => ({ ...prev, [name]: value }))
    }
  }
  const handleLineClrOnChange = (value) => {
    const desc = (value?.match(regexDesc) || [null])[1];
    const code = (value?.match(regexCode) || [null])[0];
    setAreaType({
      ...areaType,
      lcCode: code,
      lcDesc: desc,
    });
  };
  useEffect(() => {
    fetchProducts(setProductCode, handleSnackbarOpen);
    fetchTemplates(setTemplate, handleSnackbarOpen)
  }, []);
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
              value={assignAT.productCode}
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
              value={assignAT.sectionCode}
              disabled={EditMode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Template Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={assignAT.tempCode}
              options={(Template.length > 0 && Template.map((temp) => temp.tempCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'tempCode')
                }
              }}
              disabled={EditMode} />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Unit Op. Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"100%"}
              value={assignAT.mpUnitOpCode}
              options={(mpUnitOpCode?.length > 0 && mpUnitOpCode.map((stage) => stage.mpUnitCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'mpUnitOpCode')
                }
              }}
              disabled={EditMode} />
          </Grid>
        </Grid>
        {isDataAvailable && (
          <>
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={2}>
                <CustomInputLabel required label="Applicable Area Type:" />
              </Grid>
              <Grid item xs={3}>
                <CustomAutoComplete
                  options={areaTypes.map(
                    (opt) => `${opt.areaTypeCode} | ${opt.areaTypeDesc}`
                  )}
                  value={areaType.areaTypeCode}
                  onChange={handleOptionOnChange}
                  width={"100%"}
                />
              </Grid>

              <Grid item xs={7} />
              <Grid item xs={2} />
              <Grid item xs={10}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={areaType.lcReqd === "Y" ? true : false}
                      onChange={handleCheckboxChange}
                      name="lcReqd"
                    />
                  }
                  label="Line Clearance Required"
                />
              </Grid>

              <Grid item xs={2}>
                <CustomInputLabel label="Line Clearance" />
              </Grid>
              <Grid item xs={3}>
                <CustomAutoComplete
                  value={areaType.lcCode}
                  options={lineClrs.map(
                    (opt) => `${opt.lccode} | ${opt.lcdesc}`
                  )}
                  onChange={(value) => handleLineClrOnChange(value)}
                  width={"100%"}
                  disabled={areaType.lcReqd !== "Y" && true}
                />
              </Grid>
              <Grid item xs={7} />
              <Grid item xs={2} marginTop={2}>
                <CustomInputLabel label="Comment" />
              </Grid>
              <Grid item xs={10} marginTop={2}>
                <CustomOutlinedInput
                  value={assignAT.comments}
                  onChange={(e) =>
                    setAssignAT({
                      ...assignAT,
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
                  data={assignAT.basicAreaTypeClasses}
                  tableHeader={tableHeader}
                  showCheckBox={false}
                  showDeleteButton={true}
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
                    deleteAssignAT()
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
  { id: "areaTypeCode", label: "Area Type Code", field: "areaTypeCode" },
  { id: "areaTypeDesc", label: "Description", field: "areaTypeDesc" },
  { id: "lcReqd", label: "Line Clearance Required", field: "lcReqd" },
  { id: "lcCode", label: "Line Clearance Code", field: "lcCode" },
  { id: "lcDesc", label: "Description", field: "lcDesc" },
];
export default AssignAreaTypesToUnitOp;
