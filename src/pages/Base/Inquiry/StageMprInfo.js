import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import {
  CustomInputLabel,CustomButton,
  CustomOutlinedInput
} from "../../../components";
import api from "../../../api/api";
import MprTable from "../../../components/Table/MprTable";
import { useOutletContext } from "react-router-dom";

const StageMprInfo = ({ stage, product, template }) => {
  const [,handleSnackbarOpen] = useOutletContext();

  const [data, setData] = useState({
    view: "",
    ingDetails: {},
    masterFormula: {},
    pharmWeigh: {},
    ingAdjs: {},
  });

  useEffect(() => {
    fetchStageIngredientsDetails();
    fetchIngredientAdjustments();
    fetchMasterFormula();
    fetchPharmacyWeighing();
  }, [stage, product, template]);

  useEffect(() => {
    return () => {
      setData({
        view: "",
        ingDetails: {},
        masterFormula: {},
        pharmWeigh: {},
        ingAdjs: {},
      });
    };
  }, []);

  const fetchStageIngredientsDetails = async () => {
    try {
      const res = await api.get(
        `ProductMPR/MasterFormula/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const ingDetail = res.data.mfList.filter(
          (item) => item.stageCode === stage.id
        );
        setData((prevState) => {
          return {
            ...prevState,
            ingDetails: ingDetail[0] || [],
          };
        });
      }
    } catch (error) {
      handleSnackbarOpen('error','An error occured while fetching ingredient details')
      console.error(error);
    }
  };

  const fetchIngredientAdjustments = async () => {
    try {
      const res = await api.get(
        `ProductMPR/IngredientAdjustment/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const ingAdjs = res.data.ingAdj_list.filter(
          (item) => item.stageCode === stage.id
        );
        setData((prevState) => {
          return {
            ...prevState,
            ingAdjs: ingAdjs[0] || [],
          };
        });
      }
    } catch (error) {
      handleSnackbarOpen('error','An error occured while fetching ingredient adjustment details')
      console.error(error);
    }
  };
  const fetchMasterFormula = async () => {
    try {
      const res = await api.get(
        `ProductMPR/TheoriticalQuantity/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const masterFormula = res.data.filter(
          (item) => item.stageCode === stage.id
        );
        setData((prevState) => {
          return {
            ...prevState,
            masterFormula: masterFormula[0] || [],
          };
        });
      }
    } catch (error) {
      handleSnackbarOpen('error','An error occured while fetching master formula')
      console.error(error);
    }
  };

  const fetchPharmacyWeighing = async () => {
    try {
      const res = await api.get(
        `ProductMPR/PharmacyWeighing/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const pharmWeigh = res.data.filter(
          (item) => item.stageCode === stage.id
        );
        setData((prevState) => {
          return {
            ...prevState,
            pharmWeigh: pharmWeigh[0] || [],
          };
        });
      }
    } catch (error) {
      handleSnackbarOpen('error','An error occured while fetching pharmacy weighing')
      console.error(error);
    }
  };

  const viewStageIngredientsDetails = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "ingDetail" ? "" : "ingDetail",
      };
    });
  };
  const viewIngredientAdjustments = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "ingAdjs" ? "" : "ingAdjs",
      };
    });
  };
  const viewMasterFormula = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "masterFormula" ? "" : "masterFormula",
      };
    });
  };
  const viewPharmacyWeighing = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "pharmWeigh" ? "" : "pharmWeigh",
      };
    });
  };
  return (
    <Box sx={{ paddingX: 3, flexGrow: 1 }}>
      <Grid display="flex" alignItems="center" container spacing={2}>
        <Grid item xs={12} marginTop={"4px"}>
          <CustomInputLabel
            label={stage?.name?.toUpperCase()}
            sx={{ color: "Blue", fontSize: 24 }}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label="Stage Code: " />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label={stage?.id} />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label="Comments: " />
        </Grid>
        <Grid item xs={6}>
          <CustomOutlinedInput value={stage?.comments} width={"100%"} />
        </Grid>
        <Grid item xs={12}>
          <CustomButton variant="text" onClick={viewStageIngredientsDetails}>
            Stage Ingredients Details
          </CustomButton>
          <CustomButton variant="text" onClick={viewMasterFormula}>
            Master Formula
          </CustomButton>
          <CustomButton variant="text" onClick={viewPharmacyWeighing}>
            Pharmacy Weighing
          </CustomButton>
          <CustomButton variant="text" onClick={viewIngredientAdjustments}>
            Ingredient Adjustments
          </CustomButton>
        </Grid>
        <Grid item xs={12} maxHeight={"220px"}>
          {data.view === "ingDetail" && data?.ingDetails?.lstMasterFormulaClasses &&(
            <MprTable
              data={data?.ingDetails?.lstMasterFormulaClasses}
              header={tableHeaderIngDetails}
            />
          )}
          {data?.view === "ingAdjs" && data?.ingAdjs?.listIngredientAdjustment && (
            <MprTable
              data={data?.ingAdjs?.listIngredientAdjustment}
              header={tableHeaderIngAdjs}
            />
          )}
          {data?.view === "masterFormula" && data?.masterFormula?.lstThQtyClasses && (
            <MprTable
              data={data?.masterFormula?.lstThQtyClasses}
              header={tableHeaderMasterFormula}
            />
          )}
          {data?.view === "pharmWeigh" && data?.pharmWeigh?.lstPharmWeighClasses && (
            <MprTable
              data={data?.pharmWeigh?.lstPharmWeighClasses}
              header={tableHeaderPharmWeigh}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

const tableHeaderIngDetails = [
  { id: "ingProductCode", label: "Ing Product Code", field: "ingProductCode" },
  { id: "ingProductDesc", label: "Ing Product Desc", field: "ingProductDesc" },
  { id: "ingSectionCode", label: "Ing Section Code", field: "ingSectionCode" },
  { id: "ingSectionDesc", label: "Ing Section Desc", field: "ingSectionDesc" },
  { id: "seqNo", label: "Seq No", field: "seqNo" },
  { id: "perStdQtyReqd", label: "Per Std Qty Reqd", field: "perStdQtyReqd" },
  { id: "qtyPerStdKg", label: "Qty Per Std Kg", field: "qtyPerStdKg" },
  { id: "qtyPerStdG", label: "Qty Per Std G", field: "qtyPerStdG" },
  { id: "qtyPerStdMg", label: "Qty Per Std Mg", field: "qtyPerStdMg" },
  { id: "wwReqd", label: "% W/W Reqd", field: "wwReqd" },
  { id: "adjustReqd", label: "Adjust Reqd", field: "adjustReqd" },
  { id: "lotBreakable", label: "Lot Breakable", field: "lotBreakable" },
  { id: "reqdOnPharmSh", label: "Reqd On Pharm Sh", field: "reqdOnPharmSh" },
  { id: "reqdOnMstrFor", label: "Reqd On Mstr For", field: "reqdOnMstrFor" },
  { id: "forInfo", label: "For Info", field: "forInfo" },
  {
    id: "testingStandard",
    label: "Testing Standard",
    field: "testingStandard",
  },
  { id: "ingComments", label: "Ing Comments", field: "ingComments" },
];
const tableHeaderIngAdjs = [
  { id: "tctd", label: "Tctd", field: "tctd" },
  { id: "seqNo", label: "Seq No", field: "seqNo" },
  { id: "code", label: "Code", field: "code" },
  { id: "codeDesc", label: "Code Desc", field: "codeDesc" },
  { id: "assignAt", label: "Assign At", field: "assignAt" },
  { id: "selectedIngSeq", label: "Selected Ing Seq", field: "selectedIngSeq" },
  { id: "selectedIng", label: "Selected Ing", field: "selectedIng" },
  {
    id: "selectedIngDesc",
    label: "Selected Ing Desc",
    field: "selectedIngDesc",
  },
  { id: "adjusted", label: "Adjusted", field: "adjusted" },
  { id: "unit", label: "Unit", field: "unit" },
  { id: "lotNo", label: "Lot No", field: "lotNo" },
  { id: "comments", label: "Comments", field: "comments" },
];

const tableHeaderMasterFormula = [
  { id: "ingProductCode", label: "Ing Product Code", field: "ingProductCode" },
  { id: "ingProductDesc", label: "Ing Product Desc", field: "ingProductDesc" },
  { id: "seqNo", label: "Seq No", field: "seqNo" },
  { id: "qtyPerStdKg", label: "Qty Per Std (Kg)", field: "qtyPerStdKg" },
  { id: "qtyPerStdG", label: "Qty Per Std (G)", field: "qtyPerStdG" },
  { id: "qtyPerStdMg", label: "Qty Per Std (Mg)", field: "qtyPerStdMg" },
  { id: "wwValue", label: "% W/W Value", field: "wwValue" },
  { id: "lotBreakable", label: "Lot Breakable", field: "lotBreakable" },
  { id: "thQtyKg", label: "Th Qty (Kg)", field: "thQtyKg" },
  { id: "thQtyG", label: "Th Qty (G)", field: "thQtyG" },
  { id: "thQtyMg", label: "Th Qty (Mg)", field: "thQtyMg" },
];
const tableHeaderPharmWeigh = [
  { id: "ingProductCode", label: "Ing Product Code", field: "ingProductCode" },
  { id: "ingProductDesc", label: "Ing Product Desc", field: "ingProductDesc" },
  { id: "thQtyKg", label: "Th Qty (Kg)", field: "thQtyKg" },
  { id: "thQtyG", label: "ThQty (G)", field: "thQtyG" },
  { id: "thQtyMg", label: "Th Qty (Mg)", field: "thQtyMg" },
  { id: "actQtyKg", label: "Act Qty (Kg)", field: "actQtyKg" },
  { id: "actQtyG", label: "Act Qty (G)", field: "actQtyG" },
  { id: "actQtyMg", label: "Act Qty (Mg)", field: "actQtyMg" },
  { id: "adjQtyKg", label: "Adj Qty (Kg)", field: "adjQtyKg" },
  { id: "adjQtyG", label: "Adj Qty (G)", field: "adjQtyG" },
  { id: "adjQtyMg", label: "Adj Qty (Mg)", field: "adjQtyMg" },
];

export default StageMprInfo;
