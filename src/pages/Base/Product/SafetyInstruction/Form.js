import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomAutoComplete,
  ActionButtons,
} from "../../../../components";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import api from "../../../../api/api";
import { fetchProducts, fetchTemplates } from "../MasterFormula/Apis";



const CreateSafetyInstructions = ({ label }) => {
  const [loading, setloading] = useState(false);
  const [searchparams, Setsearchparams] = useSearchParams();
  const EditMode = label.startsWith("Edit") || false;
  const initAssignAt = {
    productCode: searchparams.get('prod_id') || "",
    sectionCode: searchparams.get('sec_id') || "",
    tempCode: searchparams.get('temp_id') || "",
    unitCode: searchparams.get('unit_op') || "",
    comments: "",
    safetyIns: "",
    tenantId: "1038",
  };
  const [mpUnitOpCode, setmpUnitOpCode] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [Template, setTemplate] = useState([]);
  const [safetyIns, setSafetyIns] = useState(initAssignAt);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [handleAction, handleSnackbarOpen] = useOutletContext();
  useEffect(() => {
    if (safetyIns.productCode &&
      safetyIns.tempCode &&
      safetyIns.unitCode &&
      safetyIns.sectionCode) {
      fetchSafetyIns();
    }
  }, [
    safetyIns.productCode,
    safetyIns.tempCode,
    safetyIns.unitCode,
    safetyIns.sectionCode
  ]);

  const fetchSafetyIns = async () => {
    try {
      const response = await api.get(
        `SafetyInstruction/Section/${safetyIns.sectionCode}/Product/${safetyIns.productCode}/TempCode/${safetyIns.tempCode}/UnitOperation/${safetyIns.unitCode}`
      );
      if (response.data) {
        setSafetyIns(response.data);
        setIsDataAvailable(true);
      }
    } catch (error) {
      (error.response.status === 404 && !EditMode ? setIsDataAvailable(true) : (
        handleSnackbarOpen("error", "An error occured while fetching data")
      ))
      console.error(error);
    }
  };

  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1)
  };

  const onDelete = async () => {
    try {
      const res = await api.delete(
        `SafetyInstruction/Section/${safetyIns.sectionCode}/Product/${safetyIns.productCode}/TempCode/${safetyIns.tempCode}/UnitOperation/${safetyIns.unitCode}`
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
      if (safetyIns.id) {
        const res = await api.put(
          `SafetyInstruction/Section/${safetyIns.sectionCode}/Product/${safetyIns.productCode}/TempCode/${safetyIns.tempCode}/UnitOperation/${safetyIns.unitCode}`,
          safetyIns
        );
        if (res.status === 200) {
          setloading(false)
          handleSnackbarOpen("success", "Updated successfully!");
          navigate(-1)
        }
      } else {
        const res = await api.post(
          `SafetyInstruction/Section/${safetyIns.sectionCode}/Product/${safetyIns.productCode}/TempCode/${safetyIns.tempCode}/UnitOperation/${safetyIns.unitCode}`,
          safetyIns
        );
        if (res.status === 201) {
          setloading(false)
          handleSnackbarOpen("success", "Created Successfully!");
          navigate(-1)
        }
      }
    } catch ({ response }) {
      setloading(false)
      handleSnackbarOpen("error", "An error occured on your request");
      console.error(response);
    }
  };
  const handleAutoComplete = (value, name) => {
    if (name === 'tempCode') {
      const selectedTemplate = Template.find((temp) => temp.tempCode === value)
      setmpUnitOpCode(selectedTemplate.unitOperation)
      setSafetyIns((prev) => ({ ...prev, [name]: value, mpUnitOpCode: '' }))
    }
    else if (name === 'productCode') {
      const selectedProduct = productCode.find((prod) => prod.prodcode === value)
      setSafetyIns((prev) => ({ ...prev, [name]: value, sectionCode: selectedProduct.section.sectionCode }))
    }
    else {
      setSafetyIns((prev) => ({ ...prev, [name]: value }))
    }
  }
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
              value={safetyIns.productCode}
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
              value={safetyIns.sectionCode}
              disabled={EditMode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Template Code" required />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"90%"}
              value={safetyIns.tempCode}
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
            <CustomInputLabel label="Unit Op. Code:" />
          </Grid>
          <Grid item xs={4}>
            <CustomAutoComplete
              width={"100%"}
              value={safetyIns.unitCode}
              options={(mpUnitOpCode?.length > 0 && mpUnitOpCode.map((stage) => stage.mpUnitCode)) || []}
              onChange={(val) => {
                if (val) {
                  handleAutoComplete(val, 'unitCode')
                }
              }}
              disabled={EditMode}
            />
          </Grid>
          {isDataAvailable && (
            <>
              <Grid item xs={2} marginTop={3}>
                <CustomInputLabel required label="Safety Instructions" />
              </Grid>
              <Grid item xs={10} marginTop={3}>
                <CustomOutlinedInput
                  value={safetyIns.safetyIns}
                  onChange={(e) =>
                    setSafetyIns({ ...safetyIns, safetyIns: e.target.value })
                  }
                  multiline
                  minRows={15}
                  width={"100%"}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomInputLabel required label="Comments" />
              </Grid>
              <Grid item xs={10}>
                <CustomOutlinedInput
                  value={safetyIns.comments}
                  onChange={(e) =>
                    setSafetyIns({ ...safetyIns, comments: e.target.value })
                  }
                  multiline
                  minRows={2}
                  width={"100%"}
                />
              </Grid>
            </>
          )}
        </Grid>

        {isDataAvailable && (
          <>
           <div className="buttons">
              <ActionButtons
                onClose={onCancel}
                onSubmit={onSave}
                loading={loading}
                action={EditMode}
                onDelete={() => {
                  handleAction("Are you sure you want to Delete", () =>
                      onDelete()
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

export default CreateSafetyInstructions;
