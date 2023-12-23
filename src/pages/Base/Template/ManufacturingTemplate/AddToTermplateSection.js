import React, { useEffect, useState } from "react";
import { CustomInputLabel, CustomOutlinedInput, CustomAutoComplete,CustomButton} from "../../../../components";
import {
  Box,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import api from "../../../../api/api";
import { Add } from "@mui/icons-material";

const addToTemplateOpt = [
  { label: "Stage", value: "stage" },
  { label: "Unit Operation", value: "unitOperation" },
  { label: "Step", value: "step" },
];

const regex = /^[^\s|]+/;

const initStage = {
  stageValue: "",
  addedStage: {},
};
const initUnitOp = {
  unitOpValue: "",
  addedUnitOp: {},
};
const initStep = {
  categoryValue: "",
  stepValue: "",
  addedCatgory: "",
  addedStep: "",
};

const AddToTermplateSection = ({
  template,
  addToTemplate,
  addToLevel,
  closeModal,
  onAddLevel,
}) => {
  const [stages, setStages] = useState([]);
  const [unitOps, setUnitOps] = useState([]);
  const [steps, setSteps] = useState([]);
  const [categories, setCategories] = useState([]);

  const [stageData, setStageData] = useState(initStage);
  const [unitOpData, setUnitOpData] = useState(initUnitOp);
  const [stepData, setStepData] = useState(initStep);
  const [addedLevel, setAddedLevel] = useState({});

  useEffect(() => {
    addToTemplate === "stage" && fetchStages();
    addToTemplate === "unitOp" && fetchUnitOps();
    addToTemplate === "step" && fetchCategories() && fetchSteps();
  }, []);

  const fetchStages = async () => {
    try {
      const response = await api.get(`/Stage`);
      setStages(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStage = async (id) => {
    try {
      const response = await api.get(`/Stage/${id}`);
      setStageData((prevStageData) => ({
        ...prevStageData,
        addedStage: response.data,
      }));
      addStageToTemplate(response.data, template.stage);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUnitOps = async () => {
    try {
      const response = await api.get(`/UnitOperation`);
      setUnitOps(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUnitOp = async (id) => {
    try {
      const response = await api.get(`/UnitOperation/${id}`);
      setUnitOpData((prevUnitOpData) => ({
        ...prevUnitOpData,
        addedUnitOp: response.data,
      }));
      addUnitOpToTemplate(addToLevel, response.data, template.unitOperation);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await api.get(`/StepCategory`);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategory = async (id) => {
    try {
      const response = await api.get(`/StepCategory/${id}`);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSteps = async () => {
    try {
      const response = await api.get(`/Step`);
      setSteps(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStep = async (id) => {
    try {
      const response = await api.get(`/Step/${id}`);
      setStepData((prevStepData) => ({
        ...prevStepData,
        addedStep: response.data,
      }));
      addStepToTemplate(addToLevel, response.data, template.step);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeAutoComplete = (property, value) => {
    if (!value) {
      setStageData(initStage);
      setUnitOpData(initUnitOp);
      setStepData(initStep);
    } else {
      const matchResult = value?.match(regex);
      const id = matchResult ? matchResult[0] : null;

      if (addToTemplate === "stage") {
        fetchStage(id);
        setStageData((prevStageData) => ({
          ...prevStageData,
          [property]: value,
        }));
        return;
      }
      if (addToTemplate === "unitOp") {
        fetchUnitOp(id);
        setUnitOpData((prevUnitOpData) => ({
          ...prevUnitOpData,
          [property]: value,
        }));
        return;
      }
      if (addToTemplate === "step") {
        fetchStep(id);
        setStepData((prevStepData) => ({
          ...prevStepData,
          [property]: value,
        }));
        return;
      }
    }
  };

  function addStepToTemplate(userSelectedUnitOp, userSelectedStep, stepArray) {
    const existingStep = stepArray.find(
      (step) =>
        step.stgLevelNo === userSelectedUnitOp.stageLevel &&
        step.uoLevelNo === userSelectedUnitOp.unitOperationLevel
    );

    const existingSameStep = stepArray.find(
      (step) =>
        step.stgLevelNo === userSelectedUnitOp.stageLevel &&
        step.uoLevelNo === userSelectedUnitOp.unitOperationLevel &&
        step.stepCode === userSelectedStep.stepCode
    );

    if (!existingStep) {
      const newStep = {
        stgLevelNo: userSelectedUnitOp.stageLevel,
        uoLevelNo: userSelectedUnitOp.unitOperationLevel,
        stpLevelNo: "1",
        stepCode: userSelectedStep.stepCode,
        stepDesc: userSelectedStep.stepDesc,
        skip: "",
      };
      setAddedLevel(newStep);
    } else {
      if (!existingSameStep) {
        const existingStepLevel = parseInt(existingStep.stpLevelNo);
        const newStepLevel = existingStepLevel + 1;

        const newStep = {
          stgLevelNo: userSelectedUnitOp.stageLevel,
          uoLevelNo: userSelectedUnitOp.unitOperationLevel,
          stpLevelNo: newStepLevel.toString(),
          stepCode: userSelectedStep.stepCode,
          stepDesc: userSelectedStep.stepDesc,
          skip: "",
        };
        setAddedLevel(newStep);
      }
    }
  }

  function addUnitOpToTemplate(
    userSelectedStage,
    userSelectedUnitOp,
    unitOpArray
  ) {
    const existingUnitOp = unitOpArray.find(
      (op) => op.stgLevelNo === userSelectedStage.stageLevel
    );

    const existingSameUnitOp = unitOpArray.find(
      (uO) =>
        uO.stgLevelNo === userSelectedStage.stageLevel &&
        uO.mpUnitCode === userSelectedUnitOp.mpUnitCode
    );

    if (!existingUnitOp) {
      const newUnitOp = {
        stgLevelNo: userSelectedStage.stageLevel,
        uoLevelNo: "1",
        mpUnitCode: userSelectedUnitOp.mpUnitCode,
        mpUnitDesc: userSelectedUnitOp.mpUnitDesc,
      };
      setAddedLevel(newUnitOp);
    } else {
      if (!existingSameUnitOp) {
        const existingUoLevel = parseInt(existingUnitOp.uoLevelNo);
        const newUoLevel = existingUoLevel + 1;

        const newUnitOp = {
          stgLevelNo: userSelectedStage.stageLevel,
          uoLevelNo: newUoLevel.toString(),
          mpUnitCode: userSelectedUnitOp.mpUnitCode,
          mpUnitDesc: userSelectedUnitOp.mpUnitDesc,
        };
        setAddedLevel(newUnitOp);
      }
    }
  }
  function addStageToTemplate(userSelectedStage, stageArray) {
    const existingStage = stageArray.find(
      (stage) => stage.stageCode === userSelectedStage.stageCode
    );

    if (!existingStage) {
      const maxStgLevelNo = stageArray.reduce(
        (max, stage) => Math.max(max, parseInt(stage.stgLevelNo)),
        0
      );
      const newStgLevelNo = (maxStgLevelNo + 1).toString();

      const newStage = {
        stageCode: userSelectedStage.stageCode,
        stgLevelNo: newStgLevelNo,
        stageDesc: userSelectedStage.stageDesc,
      };
      setAddedLevel(newStage);
    }
  }
  function onClickAdd() {
    onAddLevel(addedLevel);
    closeModal();
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ paddingY: 2, paddingX: 3, minHeight: "280px" }}>
        <Typography variant="h5">Add To Template</Typography>
        <Grid
          marginTop={5}
          display="flex"
          alignItems="center"
          container
          spacing={2}
        >
          {addToTemplate === "stage" && (
            <>
              <Grid item xs={3.5}>
                <CustomInputLabel required label={"Stage"} />
              </Grid>
              <Grid item xs={8.5}>
                <CustomAutoComplete
                  options={stages.map(
                    (opt) => `${opt.stageCode} | ${opt.stageDesc}`
                  )}
                  onChange={(value) =>
                    onChangeAutoComplete("stageValue", value)
                  }
                  value={stageData.stageValue}
                  width={"100%"}
                />
              </Grid>
            </>
          )}
          {addToTemplate === "unitOp" && (
            <>
              <Grid item xs={3.5}>
                <CustomInputLabel required label={"Unit Operation"} />
              </Grid>
              <Grid item xs={8.5}>
                <CustomAutoComplete
                  options={unitOps.map(
                    (opt) => `${opt.mpUnitCode} | ${opt.mpUnitDesc}`
                  )}
                  onChange={(value) =>
                    onChangeAutoComplete("unitOpValue", value)
                  }
                  value={unitOpData.unitOpValue}
                  width={"100%"}
                />
              </Grid>
            </>
          )}
          {addToTemplate === "step" && (
            <>
              <Grid item xs={3.5}>
                <CustomInputLabel required label={"Step"} />
              </Grid>
              <Grid item xs={8.5}>
                <CustomAutoComplete
                  options={steps.map(
                    (opt) => `${opt.stepCode} | ${opt.stepDesc}`
                  )}
                  onChange={(value) => onChangeAutoComplete("stepValue", value)}
                  value={stepData.stepValue}
                  width="100%"
                />
              </Grid>
              <Grid item xs={3.5}>
                <CustomInputLabel required label="Details" />
              </Grid>
              <Grid item xs={8.5}>
                <CustomOutlinedInput
                  value={stepData.stepDetail}
                  onChange={(e) =>
                    setStepData({ ...stepData, stepDetail: e.target.value })
                  }
                  multiline
                  minRows={3}
                  width={"100%"}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Box sx={{ marginY: 3 }}>
          <Stack spacing={1} direction="row">
            {addToTemplate !== "" && (
              <CustomButton
                backgroundColor="#28B463"
                variant="contained"
                onClick={onClickAdd}
              >
                Add
              </CustomButton>
            )}
            <CustomButton
              backgroundColor="#E74C3C"
              variant="contained"
              onClick={closeModal}
            >
              Cancel
            </CustomButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default AddToTermplateSection;
