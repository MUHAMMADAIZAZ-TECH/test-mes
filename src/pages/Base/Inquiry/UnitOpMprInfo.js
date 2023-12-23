import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import { CustomInputLabel, CustomOutlinedInput ,CustomButton} from "../../../components";
import api from "../../../api/api";
import MprAreaTypes from "./MprAreaTypes";

const UnitOpMprInfo = ({ unitOp, product, template }) => {
  const [safetyIns, setSafetyIns] = useState({});
  const [areaTypes, setAreaTypes] = useState({});
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    fetchSafetyIns();
    fetchAreaTypes();
  }, [unitOp, product, template]);

  useEffect(() => {
    return () => {
      setAreaTypes({});
      setSafetyIns({});
      setShowTable(false);
    };
  }, []);

  const fetchSafetyIns = async () => {
    try {
      const res = await api.get(
        `ProductMPR/SafetyInstruction/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const data = res.data.safIns_List.filter(
          (item) => unitOp.id === item.unitCode
        );
        setSafetyIns(data[0] || {});
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAreaTypes = async () => {
    try {
      const res = await api.get(
        `ProductMPR/AssignAreaType/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const data = res.data.assignAreaType_List.filter(
          (item) => unitOp.id === item.mpUnitOpCode
        );
        setAreaTypes(data[0] || {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const viewAreaType = () => {
    if (showTable === true) {
      setShowTable(false);
      return;
    }
    if (showTable === false) {
      setShowTable(true);
    }
  };

  return (
    <Box sx={{ paddingX: 3, flexGrow: 1 }}>
      <Grid display="flex" alignItems="center" container spacing={2}>
        <Grid item xs={12} marginTop={"4px"}>
          <CustomInputLabel
            label={unitOp?.name?.toUpperCase()}
            sx={{ color: "Blue", fontSize: 24 }}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputLabel label="Unit Operation Code: " />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label={unitOp?.id} />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label="Comments: " />
        </Grid>
        <Grid item xs={5}>
          <CustomOutlinedInput value={safetyIns?.comments} width={"100%"} />
        </Grid>
        <Grid item xs={3}>
          <CustomInputLabel label="Safety Instruction" />
        </Grid>
        <Grid item xs={9}>
          <CustomOutlinedInput
            value={safetyIns?.safetyIns}
            multiline
            minRows={10}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={9}>
          <CustomButton variant="text" onClick={viewAreaType}>
            View Area Types
          </CustomButton>
        </Grid>
        <Grid item xs={12}>
          {showTable && <MprAreaTypes areaTypes={areaTypes} />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UnitOpMprInfo;
