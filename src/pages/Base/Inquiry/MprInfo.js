import React, { useEffect, useState } from "react";
import { Box, Stack, Grid } from "@mui/material";
import api from "../../../api/api";
import {
  CustomOutlinedInput, CustomButton, CustomInputLabel,
  CustomModal, CustomAutoComplete, TreeView, CustomLoadingButton
} from "../../../components";
import StageMprInfo from "./StageMprInfo";
import UnitOpMprInfo from "./UnitOpMprInfo";
import StepMprInfo from "./StepMprInfo";
import MprDocuments from "./MprDocuments";
import { fetchProdDoc } from "../../Base/General/Product/Apis";
import { Close, Save, Search } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
const MprInfo = () => {
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [products, setProducts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [, handleSnackbarOpen] = useOutletContext();
  const [currentSelection, setCurrentSelection] = useState({});

  const [selectedData, setSelectedData] = useState({
    product: {},
    template: {},
  });

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/Product");
      if (res.data) {
        setProducts(
          res.data.map((opt) => {
            opt.label = `${opt.prodcode} - ${opt.prodshtname}`;
            return opt;
          })
        );
      }
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching products')
      console.error(error);
    }
  }

  async function fetchTemplates(id) {
    try {
      const res = await api.get(`/Product/${id}/TempCode`);
      if (res.data) {
        setTemplates(
          res.data.map((opt) => {
            opt.label = `${opt.templateCode}`;
            return opt;
          })
        );
      }
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching templates')
      console.error(error);
    }
  }
  async function fetchTemplate(id) {
    try {
      const res = await api.get(
        `/ProductMPR/TemplateDetail/${selectedData.product.section.sectionCode}/${selectedData.product.prodcode}/${id}`
      );
      if (res.data) {
        setSelectedData({
          ...selectedData,
          template: res.data,
        });
        setIsDataAvailable(true);
      }
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching template')
      console.error(error);
    }
  }

  const onSubmit = async () => {
    if (selectedData?.product?.section?.sectionCode && selectedData?.product?.prodcode &&
      selectedData?.template?.templateCode) {
        fetchTemplate(selectedData?.template?.templateCode);
    }
    else {
      handleSnackbarOpen("error", "Empty required fields");
    }
  };

  const onSave = () => { };

  const onClose = () => {
    setIsDataAvailable(false);
    setDisableInput(false);
    setTemplates([]);
    setProducts([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const viewESign = () => { };
  const viewProdDoc = async () => {
    if (documents.length < 1) {
      fetchProdDoc(selectedData.product.prodcode, setDocuments);
    }
    handleOpenModal();
  };

  const onSelectLevel = (val) => {
    if (val.type === "stage") {
      setCurrentSelection({ type: "stage", data: val });
    } else if (val.type === "unitOp") {
      setCurrentSelection({ type: "unitOp", data: val });
    } else if (val.type === "step") {
      setCurrentSelection({ type: "step", data: val });
    }
  };

  return (
    <>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={1.5}>
              <CustomInputLabel label="Product" required/>
            </Grid>
            <Grid item xs={3.5}>
              <CustomAutoComplete
                options={products}
                onChange={(value) => {
                  if (value) {
                    setSelectedData({
                      ...selectedData,
                      product: value,
                    });
                    fetchTemplates(value.prodcode);
                  }
                }}
                value={selectedData.product.prodcode}
                width={"100%"}
                disabled={disableInput}
              />
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={1.5}>
              <CustomInputLabel label="Section" required/>
            </Grid>
            <Grid item xs={3.5}>
              <CustomOutlinedInput
                width={"100%"}
                value={
                  selectedData?.product?.section?.sectionCode?.length > 0
                    ? `${selectedData.product.section.sectionCode} | ${selectedData.product.section.sectionDesc}`
                    : null
                }
                disabled={disableInput}
              />
            </Grid>
            <Grid item xs={1.5}>
              <CustomInputLabel label="Template" required/>
            </Grid>
            <Grid item xs={3.5}>
              <CustomAutoComplete
                options={templates}
                onChange={(value) => {
                  if (value) {
                    setSelectedData({
                      ...selectedData,
                      template: value || "",
                    });
                   
                  }
                }}
                value={selectedData.template.templateCode}
                width={"100%"}
                disabled={disableInput}
              />
            </Grid>
            <Grid item xs={2} />
            {isDataAvailable && (
              <Grid item xs={5} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton variant="text" onClick={viewESign}>
                  View E-Signature
                </CustomButton>
                <CustomButton variant="text" onClick={viewProdDoc}>
                  View Product Document
                </CustomButton>
              </Grid>
            )}
          </Grid>
        </Box>
        {!isDataAvailable && (
          <Box sx={{ marginTop: 3 }}>
            <Stack spacing={1} direction="row">
              <CustomLoadingButton
                backgroundColor="#28B463"
                variant="contained"
                onClick={onSubmit}
                startIcon={<Search />}
              >
                Search
              </CustomLoadingButton>
              <CustomButton
                backgroundColor="#E74C3C"
                variant="contained"
                startIcon={<Close/>}
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
              <Grid
                display="flex"
                alignItems="flex-start"
                container
                spacing={2}
              >
                <Grid item xs={3.5}>
                  <Box
                    sx={{
                      borderRadius: 1,
                      paddingX: 2,
                      backgroundColor: "#dcdde6",
                      border: "1px solid lightgray",
                    }}
                  >
                    <TreeView
                      data={selectedData.template}
                      onSelectLevel={onSelectLevel}
                    />
                  </Box>
                </Grid>
                <Grid item xs={8.5}>
                  {currentSelection.type === "stage" ? (
                    <Box
                      sx={{
                        borderRadius: 1,
                        paddingY: 1,
                        paddingX: 1,
                        border: "1px solid lightgray",
                        minHeight: "550px",
                        maxHeight: "550px",
                        overflow: "auto",
                      }}
                    >
                      <StageMprInfo
                        stage={currentSelection.data}
                        product={selectedData.product}
                        template={selectedData.template}
                      />
                    </Box>
                  ) : currentSelection.type === "unitOp" ? (
                    <Box
                      sx={{
                        borderRadius: 1,
                        paddingY: 1,
                        paddingX: 1,
                        border: "1px solid lightgray",
                        maxHeight: "550px",
                        minHeight: "550px",
                        overflow: "auto",
                      }}
                    >
                      <UnitOpMprInfo
                        unitOp={currentSelection.data}
                        product={selectedData.product}
                        template={selectedData.template}
                      />
                    </Box>
                  ) : currentSelection.type === "step" ? (
                    <Box
                      sx={{
                        borderRadius: 1,
                        paddingY: 1,
                        paddingX: 1,
                        border: "1px solid lightgray",
                        minHeight: "550px",
                        maxHeight: "550px",
                        overflow: "auto",
                      }}
                    >
                      <StepMprInfo
                        step={currentSelection.data}
                        product={selectedData.product}
                        template={selectedData.template}
                      />
                    </Box>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ marginY: 3 }}>
              <Stack spacing={1} direction="row">
                <CustomLoadingButton
                  backgroundColor="#28B463"
                  variant="contained"
                  onClick={onSave}
                  startIcon={<Save />}
                >
                  Save
                </CustomLoadingButton>

                <CustomButton
                  backgroundColor="#E74C3C"
                  variant="contained"
                  onClick={onClose}
                  startIcon={<Close/>}
                >
                  Close
                </CustomButton>
              </Stack>
            </Box>
          </>
        )}
      </Box>
      <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        content={<MprDocuments documents={documents} />}
      />
    </>
  );
};

export default MprInfo;
