import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
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
import { fetchProducts, fetchTemplates } from "../MasterFormula/Apis";

const regexCode = /^[^\s|]+/;
const regexDesc = /\| (.*)/;

function doesIdExist(arr, obj) {
  return arr.basicEquipmentTypes.some(
    (item) => item.eqpTypeCode === obj.eqpTypeCode
  );
}

const initTemp = {
  eqpTypeCode: "",
  eqpTypeDesc: "",
  minimumNo: "",
};


const CreateAssignEquipment = ({ label }) => {
  const [searchparams, Setsearchparams] = useSearchParams();
  const EditMode = label.startsWith("Edit") || false;
  const initAssignEt = {
    productCode: searchparams.get('prod_id') || "",
    sectionCode: searchparams.get('sec_id') || "",
    tempCode: searchparams.get('temp_id') || "",
    stepCode: searchparams.get('step') || "",
    basicEquipmentTypes: [],
    tenantId: "1038",
  };
  const [step, setstep] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [Template, setTemplate] = useState([]);
  const [assignET, setAssignET] = useState(initAssignEt);
  const [eqpType, setEqpType] = useState(initTemp);
  const [loading, setloading] = useState(false);
  const [eqpTypes, setEqpTypes] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [handleAction, handleSnackbarOpen] = useOutletContext();

  useEffect(() => {
    if (assignET.productCode &&
      assignET.tempCode &&
      assignET.stepCode &&
      assignET.sectionCode)
      fetchAssignET();
    fetchEqpTypes();
  }, [
    assignET.productCode,
    assignET.tempCode,
    assignET.stepCode,
    assignET.sectionCode]);

  const fetchAssignET = async () => {
    try {
      const response = await api.get(
        `/AssignEquipmentTypeToSteps/${assignET.sectionCode}/${assignET.productCode}/${assignET.tempCode}/${assignET.stepCode}`
      );
      if (response.data) {
        setAssignET(response.data);
        setIsDataAvailable(true);
      }
    } catch ({ response }) {
      (response.status === 404 && !EditMode ? setIsDataAvailable(true) : (
        handleSnackbarOpen("error", "An error occured while fetching data")
      ))
      console.error(response);
    }
  };

  const fetchEqpTypes = async () => {
    try {
      const response = await api.get(`/EquipmentType`);
      if (response.data) {
        setEqpTypes(response.data);
      }
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching Equipment Types");
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
        `AssignEquipmentTypeToSteps/${assignET.productCode}/${assignET.sectionCode}/${assignET.stepCode}/${assignET.tempCode}`
      );
      if (res.status === 204) {
        handleSnackbarOpen("success", "Deleted successfully!");
        navigate(-1)
      }
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while deleting");
      console.error(response);
    }
  };

  const onSave = async () => {
    setloading(true)
    try {
      if (assignET.id) {
        const res = await api.put(`/AssignEquipmentTypeToSteps/${1}`, assignET);
        if (res.status === 200) {
          handleSnackbarOpen("success", "Updated successfully!");
          navigate(-1)
          setloading(false)
        }
      } else {
        const res = await api.post(`/AssignEquipmentTypeToSteps`, assignET);
        if (res.status === 201) {
          handleSnackbarOpen("success", "Created Successfully!");
          navigate(-1)
          setloading(false)

        }
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured on your request");
      console.error(response);
    }
  };

  const onAdd = () => {
    if (!eqpType.eqpTypeCode) {
      handleSnackbarOpen("error", "Empty required fields", true);
    } else {
      if (doesIdExist(assignET, eqpType)) {
        handleSnackbarOpen(
          "error",
          "This equipment type code already exists",
          true
        );
      } else {
        const updatedClasses = [...assignET.basicEquipmentTypes];
        updatedClasses.push(eqpType);
        setAssignET({
          ...assignET,
          basicEquipmentTypes: updatedClasses,
        });
        setEqpType(initTemp);
      }
    }
  };

  const onRemove = (data) => {
    const filteredArray = assignET.basicEquipmentTypes.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(data);
    });
    setAssignET({
      ...assignET,
      basicEquipmentTypes: filteredArray,
    });
  };

  const handleOptionOnChange = (value) => {
    const desc = (value?.match(regexDesc) || [null])[1];
    const code = (value?.match(regexCode) || [null])[0];
    setEqpType({
      ...eqpType,
      eqpTypeCode: code,
      eqpTypeDesc: desc,
    });
  };
  const handlePrint = () => {
    let printContents = document.getElementById('eqtosteps').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }
  const handleAutoComplete = (value, name) => {
    if (name === 'tempCode') {
      const selectedTemplate = Template.find((temp) => temp.tempCode === value)
      setstep(selectedTemplate.step)
      setAssignET((prev) => ({ ...prev, [name]: value, mpUnitOpCode: '' }))
    }
    else if (name === 'productCode') {
      const selectedProduct = productCode.find((prod) => prod.prodcode === value)
      setAssignET((prev) => ({ ...prev, [name]: value, sectionCode: selectedProduct.section.sectionCode }))
    }
    else {
      setAssignET((prev) => ({ ...prev, [name]: value }))
    }
  }
  useEffect(() => {
    fetchProducts(setProductCode, handleSnackbarOpen);
    fetchTemplates(setTemplate, handleSnackbarOpen)
  }, []);
  return (
    <div id="eqtosteps">
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
              value={assignET.productCode}
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
              value={assignET.sectionCode}
              disabled={EditMode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Template Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={assignET.tempCode}
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
            <CustomInputLabel label="Step Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"100%"}
              value={assignET.stepCode}
              options={(step?.length > 0 && step.map((stage) => stage.stepCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'stepCode')
                }
              }}
              disabled={EditMode}
            />
          </Grid>
        </Grid>

        {isDataAvailable && (
          <>
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={2.5}>
                <CustomInputLabel required label="Applicable Equipment Type" />
              </Grid>
              <Grid item xs={3}>
                <CustomAutoComplete
                  options={eqpTypes.map(
                    (opt) => `${opt.insTypeCode} | ${opt.insTypeDesc}`
                  )}
                  value={eqpType.eqpTypeCode}
                  onChange={handleOptionOnChange}
                  width={"100%"}
                />
              </Grid>

              <Grid item xs={2}>
                <CustomInputLabel
                  sx={{ marginLeft: 1 }}
                  label={eqpType.eqpTypeDesc}
                />
              </Grid>
              <Grid item xs={1.5} />
              <Grid item xs={1.5}>
                <CustomInputLabel label="Minimum No." />
              </Grid>
              <Grid item xs={1.5}>
                <CustomOutlinedInput
                  value={eqpType.minimumNo}
                  onChange={(e) =>
                    setEqpType({
                      ...eqpType,
                      minimumNo: e.target.value,
                    })
                  }
                  type={"number"}
                  width={"100%"}
                />
              </Grid>
              <Grid item xs={2.5}>
                <CustomInputLabel label="Comment" />
              </Grid>
              <Grid item xs={9.5}>
                <CustomOutlinedInput
                  value={assignET.comments}
                  onChange={(e) =>
                    setAssignET({
                      ...assignET,
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
                  data={assignET.basicEquipmentTypes}
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
                handlePrint={handlePrint}
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
    </div>
  );
};

const tableHeader = [
  { id: "eqpTypeCode", label: "Equipment Type Code", field: "eqpTypeCode" },
  { id: "eqpTypeDesc", label: "Description", field: "eqpTypeDesc" },
  { id: "minimumNo", label: "Minimum No", field: "minimumNo" },
];
export default CreateAssignEquipment;
