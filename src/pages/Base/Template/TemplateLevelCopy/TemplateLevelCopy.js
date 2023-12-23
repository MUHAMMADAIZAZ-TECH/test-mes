import React, { useEffect, useState } from "react";
import { Box, Stack, Grid } from "@mui/material";
import { CustomButton, TemplateSection, CustomDataGrid, CustomLoadingButton } from "../../../../components";
import api from "../../../../api/api";
import { Close, Save, Search } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const TemplateLevelCopy = () => {
  const [loading, setLoading] = useState(false);
  const [Target, setTarget] = useState(InitialState);
  const [Source, setSource] = useState(InitialState);
  const [TargetErrors, setTargetErrors] = useState(InitialErrors);
  const [, handleSnackbarOpen] = useOutletContext();
  const [dataFound, setdataFound] = useState(false);
  const [Templates, setTemplates] = useState([]);
  const [data, setData] = useState(mockupData);
  const [selectedRow, setselectedRow] = useState([])
  const onTemplateCode = async (tempName, setState) => {
    const values = tempName?.split(" | ");
    if (tempName !== undefined && tempName !== null) {
      const TempCode = values[0] || "";
      const Template = await fetchTemplatesById(TempCode);
      setState((prev) => ({ ...prev, TempCode, tempName, StageCode: "", UnitCode: "", Template, }));
    }
  };
  async function fetchTemplatesById(id) {
    try {
      const response = await api.get(`/Template/${id}`);
      return response.data;
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching template')
      console.error(error);
    }
  }
  const onSubmit = () => {
    const newErrors = {
      ...TargetErrors,
      StageCodeFr: Source.StageCode === "" ? "Stage Code is required" : "",
      TempCodeFr: Source.TempCode === "" ? "Template Code is required" : "",
      UnitCodeFr: Source.UnitCode === "" ? "Unit Code is required" : "",
      TempCodeTo: Target.TempCode === "" ? "Template Code is required" : "",
      StageCodeTo: Target.StageCode === "" ? "Stage Code is required" : "",
      UnitCodeTo: Target.UnitCode === "" ? "Unit Code is required" : "",
    };
    setTargetErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      GetCommonSteps(Source)
    }
    else {
      handleSnackbarOpen("error", "Empty required fields");
    }
  };
  const GetCommonSteps = async () => {
    setLoading(true)
    try {
      const response = await api.get(`ValueFromPreviousStep/${Source.TempCode}/${Source.StageCode}/${Source.UnitCode}/${Target.TempCode}/${Target.StageCode}/${Target.UnitCode}`);
      if (response.status === 200) {
        console.log(response.data);
        setdataFound(true)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setdataFound(false)
      console.error(error);
      if (error.response.status === 404) {
        handleSnackbarOpen('error', error.response.data)
      }
      else{
       handleSnackbarOpen('error', 'An error occured while creating copy')
      }

    }
  };
  const PostCommonSteps = async (body) => {
    setLoading(true)
    try {
      const response = await api.post(`ValueFromPreviousStep/PostMultipleValueFromPreviousStep`, body);
      console.log(response);
      setdataFound(true)
      setLoading(false)
      onCancel()
    } catch (error) {
      setLoading(false)
      setdataFound(true)
      console.error(error);
      handleSnackbarOpen('error', 'An error occured while creating copy')
    }
  };
  const onChange = (e, setState) => setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function fetchTemplates() {
    try {
      const response = await api.get("/Template");
      if (response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching templates')
      console.error(error);
    }
  }
  const onCancel = () => {
    setSource(InitialState);
    setTarget(InitialState);
    setdataFound(false);
  };
  const onSave = () => {
    if (selectedRow.length > 0) {
      PostCommonSteps(selectedRow)
    }
    else {
      handleSnackbarOpen('error', 'No rows selected!')
    }
  };
  useEffect(() => {
    (async () => {
      await fetchTemplates();
    })();
  }, []);
  return (
    <>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={5.75}>
              <TemplateSection
                Templates={Templates}
                State={Source}
                label={"Source"}
                onTemplateCode={(e) => onTemplateCode(e, setSource)}
                onChange={(e) => onChange(e, setSource)}
              />
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={5.75}>
              <TemplateSection
                Templates={Templates}
                State={Target}
                label={"Target"}
                onTemplateCode={(e) => onTemplateCode(e, setTarget)}
                onChange={(e) => onChange(e, setTarget)}
              />
            </Grid>
          </Grid>
        </Box>
        {dataFound && (
          <Box sx={{ flexGrow: 1, marginTop: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={12}>
                <CustomDataGrid
                  rows={data}
                  columns={tableHeaderArea}
                  checkboxSelection={true}
                  setselectedRow={setselectedRow}
                  paginationMode='client'
                  hideFooterPagination
                  sx={{ height: 400, width: '100%' }}
                  hideexport={true}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box sx={{ marginTop: 3 }}>
          <Stack spacing={1} direction="row" justifyContent={"flex-start"}>
            {dataFound ? (
              <>
                <CustomLoadingButton
                  backgroundColor="#28B463"
                  variant="contained"
                  onClick={onSave}
                  loading={loading}
                  loadingPosition={'start'}
                  startIcon={<Save />}
                >
                  Save
                </CustomLoadingButton>
              </>
            ) : (
              <>
                <CustomLoadingButton
                  backgroundColor="#28B463"
                  variant="contained"
                  onClick={onSubmit}
                  loading={loading}
                  loadingPosition={'start'}
                  startIcon={<Search />}
                >
                  Search
                </CustomLoadingButton>
              </>
            )}
            <CustomButton
              disabled={loading}
              backgroundColor="#E74C3C"
              variant="contained"
              onClick={onCancel}
              startIcon={<Close/>}
            >
              Close
            </CustomButton>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
const InitialState = {
  tempName: "",
  TempCode: "",
  StageCode: "",
  UnitCode: "",
  Template: null
};
const InitialErrors = {
  TempCodeTo: "",
  StageCodeTo: "",
  UnitCodeTo: "",
  TempCodeFr: "",
  StageCodeFr: "",
  UnitCodeFr: "",
}
const tableHeaderArea = [
  { field: 'stepcode', headerName: 'Step Code', flex: 1 },
  { field: 'stepDesc', headerName: 'Step Desc', flex: 1 },
  { field: 'testrawdata1', headerName: 'Test / Raw Data', flex: 1 },
  { field: 'test1', headerName: 'Test', flex: 1 },
  { field: 'rawdata1', headerName: 'Raw Data', flex: 1 },
  { field: 'copiedfrom', headerName: 'Copied From', flex: 1 },
  { field: 'desc', headerName: 'Description', flex: 1 },
  { field: 'testrawdata2', headerName: 'Test / Raw Data', flex: 1 },
  { field: 'test2', headerName: 'Test', flex: 1 },
  { field: 'rawdata2', headerName: 'Raw Data', flex: 1 },

]
const mockupData = [
  {
    id: "adsada",
    stepcode: "Cap0015",
    stepDesc: "Reconcilation (Encapsulation)",
    testrawdata1: "Raw Data",
    test1: "N/A",
    rawdata1: "Theoritical weightage",
    copiedfrom: "Cap0025",
    desc: "Determine Total net weight of acceptable capsules",
    testrawdata2: "test",
    test2: "Net weight",
    rawdata2: "N/A",
  },
  {
    id: "adsasdada",
    stepcode: "Cap0018",
    stepDesc: "Reconcilation (Encapsulation)",
    testrawdata1: "Raw Data",
    test1: "N/A",
    rawdata1: "Theoritical weightage",
    copiedfrom: "Cap0045",
    desc: "Determine Total net weight of acceptable capsules",
    testrawdata2: "test",
    test2: "Net weight",
    rawdata2: "N/A",
  },
  // Add more mockup data entries as needed
];
export default TemplateLevelCopy;
