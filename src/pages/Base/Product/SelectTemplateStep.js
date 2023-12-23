import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import api from "../../../api/api";
import {
  CustomInputLabel, CustomButton,
  CustomAutoComplete
} from "../../../components";
import { useNavigate, useOutletContext } from "react-router-dom";

const regex = /^[^\s|]+/;

const SelectTemplateStep = ({ data, onCloseModal, screen, route }) => {
  const [steps, setSteps] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [step, setStep] = useState({
    name: "",
    value: {},
  });
  const [, handleSnackbarOpen] = useOutletContext();
  const [template, setTemplate] = useState({
    name: "",
    value: {},
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await fetchTemplates(data.prodcode);
    })();
  }, []);

  const fetchTemplates = async (id) => {
    try {
      const response = await api.get(`/Product/${id}/TempCode`);
      if (response.data) {
        setTemplates(response.data);
      }
    } catch ({ response }) {
      handleSnackbarOpen('error', 'An error occured while fetching template')
      console.error(response);
    }
  };

  const onChangeTemplate = async (value) => {
    if (value) {
      try {
        const matchResult = value?.match(regex);
        const result = matchResult ? matchResult[0] : null;

        const response = await api.get(`/Template/${result}`);
        if (response.data) {
          setTemplate({
            ...template,
            name: value,
            value: response.data,
          });
          setSteps(response.data.step);
        }
      } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching template')
        console.error(response);
      }
    }
  };

  const onChangeStep = (value) => {
    if (value) {
      const matchResult = value?.match(regex);
      const result = matchResult ? matchResult[0] : null;
      setStep({
        ...step,
        name: value,
        value: result,
      });
    }
  };

  const onClickNext = () => {
    if (data?.prodcode && template?.value && step?.value && data?.section?.sectionCode) {
      onCloseModal();
      navigate(`${route}/edit?prod_id=${data.prodcode}&&temp_id=${template.value.tempCode}&&sec_id=${data.section.sectionCode}&&step=${step.value}`);
    }
  };
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography fontWeight={"bold"} variant="h6" sx={{ marginBottom: 4 }}>
        {`${data.prodcode} | ${data.prodshtname}`}
      </Typography>
      <Grid display="flex" alignItems="center" container spacing={2}>
        <Grid item xs={3}>
          <CustomInputLabel required label="Section Code" />
        </Grid>
        <Grid item xs={9}>
          <CustomInputLabel
            label={`${data.section.sectionCode} | ${data.section.sectionDesc}`}
          />
        </Grid>

        <Grid item xs={3}>
          <CustomInputLabel required label="Template" />
        </Grid>
        <Grid item xs={9}>
          <CustomAutoComplete
            options={templates.map(
              (opt) => `${opt.templateCode} | ${opt.templateDesc}`
            )}
            onChange={onChangeTemplate}
            value={template.name}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputLabel required label="Step" />
        </Grid>
        <Grid item xs={9}>
          <CustomAutoComplete
            options={steps.map((opt) => `${opt.stepCode} | ${opt.stepDesc}`)}
            onChange={onChangeStep}
            value={step.name}
            width={"100%"}
          />
        </Grid>
      </Grid>
      <CustomButton
        sx={{ marginTop: 2, marginLeft: "89%" }}
        backgroundColor="#28B463"
        variant="contained"
        onClick={onClickNext}
      >
        Next
      </CustomButton>
    </Box>
  );
};

export default SelectTemplateStep;
