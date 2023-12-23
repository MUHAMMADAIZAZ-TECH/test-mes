import React, { useEffect, useState } from "react";
import { Box, Stack, Grid } from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomButton,
  CustomAutoComplete,
  CustomLoadingButton,
} from "../../../../components";
import { fetchProducts, regenerateMpr, generateMpr, fetchTemplates, onSubmit } from "./Apis";
import { Close, Restore, Search } from "@mui/icons-material";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";

const MprGeneration = ({ label }) => {
  const EditMode = label.startsWith("Edit") || false;
  const [searchparams, Setsearchparams] = useSearchParams();
  const sectionCode = searchparams.get('sec_id') || "";
  const prodCode = searchparams.get('prod_id') || "";
  const tempCode = searchparams.get('temp_id') || "";
  const sectionDesc = searchparams.get('sec_des') || "";
  const prodDesc = searchparams.get('prod_des') || "";
  const templateDesc = searchparams.get('temp_des') || "";

  const navigate = useNavigate();
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [products, setProducts] = useState([]);
  const [mpr, setMpr] = useState(null);
  const [loading, setloading] = useState(false);
  const [, handleSnackbarOpen] = useOutletContext();

  const [selectedData, setSelectedData] = useState({
    product: {},
    template: {},
  });

  useEffect(() => {
    if (!EditMode) {
      (async () => {
        await fetchProducts(setProducts, handleSnackbarOpen);
      })();
    }
    else {
      onSubmit(
        setloading,
        { sectionCode, prodCode, tempCode, EditMode },
        setMpr,
        setIsDataAvailable,
        handleSnackbarOpen,
      )
    }
  }, []);

  const onSave = () => {
    const Body = {
      sectionCode: EditMode ? sectionCode : selectedData.product.section.sectionCode,
      prodcode: EditMode ? prodCode : selectedData.product.prodcode,
      tempCode: EditMode ? tempCode : selectedData.template.templateCode,
      secDesc: EditMode ? sectionDesc : selectedData.product.section.sectionDesc,
      prodDesc: EditMode ? prodDesc : selectedData.product.prodshtname,
      tempDesc: EditMode ? templateDesc : selectedData.template.templateDesc,
      tenantId: "1038",
    }
    if (mpr) {
      regenerateMpr(setloading, Body, handleSnackbarOpen);
    } else {
      generateMpr(setloading, Body, handleSnackbarOpen);
    }
  };

  const onClose = () => {
    navigate(-1)
  };

  return (
    <>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
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
                      setSelectedData((prev) => ({
                        ...prev,
                        product: value,
                      }));
                      fetchTemplates(
                        value.prodcode,
                        setTemplates,
                        handleSnackbarOpen
                      );
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
                width={"100%"}
                value={
                  selectedData?.product?.section?.sectionCode?.length > 0 && selectedData.product.section.sectionDesc
                    ? `${selectedData.product.section.sectionCode} | ${selectedData.product.section.sectionDesc}`
                    : sectionCode || ''
                }
              />
            </Grid>
            <Grid item xs={1.5}>
              <CustomInputLabel label="Template:" />
            </Grid>
            <Grid item xs={3.5}>
              {EditMode ? <CustomOutlinedInput
                width={"100%"}
                disabled
                value={tempCode}
              /> :
                <CustomAutoComplete
                  options={templates}
                  onChange={(value) => {
                    if (value) {
                      setSelectedData((prev) => ({
                        ...prev,
                        template: value,
                      }));
                    }
                  }}
                  value={selectedData.template.templateCode}
                  width={"100%"}
                />
              }
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </Box>
        {!isDataAvailable && (
          <Box sx={{ marginTop: 3 }}>
            <Stack spacing={1} direction="row">
              <CustomLoadingButton
                backgroundColor="#28B463"
                variant="contained"
                onClick={() => onSubmit(
                  setloading,
                  {
                    sectionCode: selectedData.product?.section?.sectionCode,
                    prodCode: selectedData?.product?.prodcode,
                    tempCode: selectedData?.template?.templateCode,
                    EditMode
                  },
                  setMpr,
                  setIsDataAvailable,
                  handleSnackbarOpen
                )}
                startIcon={<Search />}
                loading={loading}
                loadingPosition={'start'}
              >
                Search
              </CustomLoadingButton>
              <CustomButton
                disabled={loading && loading}
                backgroundColor="#E74C3C"
                variant="contained"
                startIcon={<Close />}
                onClick={onClose}
              >
                Close
              </CustomButton>
            </Stack>
          </Box>
        )}
        {isDataAvailable && (
          <>
            <Box sx={{ marginTop: 5, flexGrow: 1 }}>
              <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                  <CustomLoadingButton
                    backgroundColor="#3498DB"
                    variant="contained"
                    onClick={onSave}
                    loading={loading}
                    loadingPosition={'start'}
                    startIcon={<Restore/>}
                    sx={{ marginRight: 2 }}
                  >
                    {mpr ? "Regenerate MPR" : "Generate MPR"}
                  </CustomLoadingButton>
                  <CustomButton
                    disabled={loading && loading}
                    backgroundColor="#E74C3C"
                    variant="contained"
                    startIcon={<Close />}
                    onClick={onClose}
                  >
                    Cancel
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default MprGeneration;
