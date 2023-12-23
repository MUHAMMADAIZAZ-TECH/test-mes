import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { CustomInputLabel, CustomOutlinedInput } from "../../../../components/InputFields/CustomInput";
import api from "../../../../api/api";

function removeHtmlTags(inputString) {
  if (inputString) {
    return inputString.replace(/<\/?[^>]+(>|$)/g, "");
  }
}

const SelectedStageView = ({ selectedValue }) => {
  const [level, setLevel] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    if (Object.keys(selectedValue).length === 0) {
      setLevel("");
      setData({});
    }
    if (
      selectedValue.stageLevel &&
      selectedValue.unitOperationLevel &&
      selectedValue.stepLevel
    ) {
      setLevel("step");
      fetchStep(selectedValue.id);
    }
    if (
      selectedValue.stageLevel &&
      selectedValue.unitOperationLevel &&
      !selectedValue.stepLevel
    ) {
      setLevel("unitOp");
      fetchUnitOp(selectedValue.id);
    }
    if (
      selectedValue.stageLevel &&
      !selectedValue.unitOperationLevel &&
      !selectedValue.stepLevel
    ) {
      setLevel("stage");
      fetchStage(selectedValue.id);
    }
  }, [selectedValue]);

  const fetchStep = async (id) => {
    try {
      const response = await api.get(`/Step/${id}`);
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUnitOp = async (id) => {
    try {
      const response = await api.get(`/UnitOperation/${id}`);
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStage = async (id) => {
    try {
      const response = await api.get(`/stage/${id}`);
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      {level === "stage" || level === "unitOp" || level === "step" ? (
        <Grid
          display="flex"
          alignItems="center"
          container
          spacing={2}
          paddingY={2}
        >
          <Grid item xs={3}>
            <CustomInputLabel
              label={
                level === "stage"
                  ? "Stage Code"
                  : level === "unitOp"
                  ? "Unit Operation Code"
                  : "Step Code"
              }
            />
          </Grid>
          <Grid item xs={9}>
            <CustomInputLabel
              label={
                level === "stage"
                  ? data.stageCode
                  : level === "unitOp"
                  ? data.mpUnitCode
                  : data.stepCode
              }
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputLabel label="Description" />
          </Grid>
          <Grid item xs={9}>
            <CustomOutlinedInput
              disabled
              value={
                level === "stage"
                  ? data.stageDesc
                  : level === "unitOp"
                  ? data.mpUnitDesc
                  : data.stepDesc
              }
              width="95%"
            />
          </Grid>
          {level === "step" && (
            <>
              <Grid item xs={3}>
                <CustomInputLabel label="Details" />
              </Grid>
              <Grid item xs={9}>
                <CustomOutlinedInput
                  disabled
                  multiline
                  minRows={4}
                  value={removeHtmlTags(data.stepDetailsHTML)}
                  width="95%"
                />
              </Grid>
            </>
          )}
        </Grid>
      ) : null}
    </Box>
  );
};

export default SelectedStageView;
