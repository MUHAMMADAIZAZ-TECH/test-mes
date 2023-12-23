import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import {
  CustomInputLabel,
  CustomOutlinedInput,CustomButton
} from "../../../components";
import api from "../../../api/api";
import MprTable from "../../../components/Table/MprTable";

const StepMprInfo = ({ step, product, template }) => {
  const [data, setData] = useState({
    view: "",
    step: {},
    validation: {},
    variable: {},
    equipment: {},
  });

  useEffect(() => {
    fetchStep();
    fetchEquipmentTypes();
    fetchValidations();
  }, [step, product, template]);

  useEffect(() => {
    return () => {
      setData({
        view: "",
        step: {},
        validation: {},
        variable: {},
        equipment: {},
      });
    };
  }, []);

  const fetchStep = async () => {
    try {
      const res = await api.get(
        `ProductMPR/TemplateSteps/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const stp = res.data.steps.filter((item) => item.stepCode === step.id);
        setData((prevState) => {
          return {
            ...prevState,
            step: stp[0],
          };
        });

        fetchVariables(stp[0].stepCateCode);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchValidations = async () => {
    try {
      const res = await api.get(
        `ProductMPR/ProdLvlStepValidation/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const val = res.data.prodlvlStpValidList.filter(
          (item) => item.stepCode === step.id
        );
        setData((prevState) => {
          return {
            ...prevState,
            validation: val[0] || [],
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVariables = async (stepCategory) => {
    try {
      const res = await api.get(
        `ProductMPR/ProductVariable/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const variables = res.data.prodVarList.filter(
          (item) => item.stepCategory === stepCategory
        );
        const reqVariables = variables[0].variables.filter(
          (item) => item.stepCode === step.id
        );

        setData((prevState) => {
          return {
            ...prevState,
            variable: reqVariables || [],
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEquipmentTypes = async () => {
    try {
      const res = await api.get(
        `ProductMPR/AssignEqpType/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`
      );
      if (res.data) {
        const eqp = res.data.assignEquipmentTypes_List.filter(
          (item) => item.stepCode === step.id
        );
        setData((prevState) => {
          return {
            ...prevState,
            equipment: eqp[0] || [],
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const viewRawData = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "rawData" ? "" : "rawData",
      };
    });
  };
  const viewTests = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "test" ? "" : "test",
      };
    });
  };
  const viewValidation = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "validation" ? "" : "validation",
      };
    });
  };
  const viewVariables = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "variable" ? "" : "variable",
      };
    });
  };
  const viewEquipments = () => {
    setData((prevState) => {
      return {
        ...prevState,
        view: prevState.view === "equipment" ? "" : "equipment",
      };
    });
  };

  return (
    <Box sx={{ paddingX: 3, flexGrow: 1 }}>
      <Grid display="flex" alignItems="center" container spacing={2}>
        <Grid item xs={12} marginTop={"4px"}>
          <CustomInputLabel
            label={data?.step?.stepDesc?.toUpperCase()}
            sx={{ color: "Blue", fontSize: 24 }}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label="Step Code: " />
        </Grid>
        <Grid item xs={3}>
          <CustomInputLabel label={data?.step?.stepCode} />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={2}>
          <CustomInputLabel label="Seq. No: " />
        </Grid>
        <Grid item xs={4}>
          <CustomInputLabel label={data?.step?.seqNo} />
        </Grid>

        <Grid item xs={2}>
          <CustomInputLabel label="Comments: " />
        </Grid>
        <Grid item xs={10}>
          <CustomOutlinedInput value={data?.step?.comments} width={"100%"} />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label="Details: " />
        </Grid>
        <Grid item xs={10}>
          <CustomOutlinedInput
            value={data?.step?.stepDetailsRTF}
            multiline
            minRows={10}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel label="Note: " />
        </Grid>
        <Grid item xs={10}>
          <CustomOutlinedInput
            value={data?.step?.noteRTF}
            multiline
            minRows={2}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={10}>
          <CustomButton variant="text" onClick={viewRawData}>
            View RawData
          </CustomButton>
          <CustomButton variant="text" onClick={viewTests}>
            View Tests
          </CustomButton>
          <CustomButton variant="text" onClick={viewValidation}>
            View Validation
          </CustomButton>
          <CustomButton variant="text" onClick={viewVariables}>
            View Variables
          </CustomButton>
          <CustomButton variant="text" onClick={viewEquipments}>
            View Equipments
          </CustomButton>
        </Grid>
        <Grid item xs={12} maxHeight={"220px"}>
          {data?.view === "rawData" && (
            <MprTable data={data?.step?.rawData} header={tableHeaderRawData} />
          )}
          {data?.view === "test" && (
            <MprTable data={data?.step?.tests} header={tableHeaderTest} />
          )}
          {data?.view === "validation" && (
            <MprTable
              data={data?.validation?.lstProductLevelStepValidations}
              header={tableHeaderValidation}
            />
          )}
          {data?.view === "variable" && (
            <MprTable data={data?.variable} header={tableHeaderVariable} />
          )}
          {data?.view === "equipment" && (
            <MprTable
              data={data?.equipment?.basicEquipmentTypes}
              header={tableHeaderEquipments}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepMprInfo;

// `/ProductMPR/TemplateSteps/${product.section.sectionCode}/${product.prodcode}/${template.tempCode}`

const tableHeaderRawData = [
  { id: "seqNo", label: "Seq No", field: "seqNo" },
  { id: "testDataCode", label: "Test Data Code", field: "testDataCode" },
  { id: "testDataDesc", label: "Test Data Desc", field: "testDataDesc" },
  { id: "noOfReading", label: "No Of Reading", field: "noOfReading" },
  { id: "behaviour", label: "Behaviour", field: "behaviour" },
  { id: "unit", label: "Unit", field: "unit" },
  { id: "assignment", label: "Assignment", field: "assignment" },
  { id: "valueType", label: "Value Type", field: "valueType" },
  { id: "multipleUnit", label: "Multiple Unit", field: "multipleUnit" },
  { id: "comments", label: "Comments", field: "comments" },
];
const tableHeaderTest = [
  { id: "seqNo", label: "Seq No", field: "seqNo" },
  { id: "testcode", label: "Test Code", field: "testcode" },
  { id: "testshtdesc", label: "Test Sht Desc", field: "testshtdesc" },
  { id: "testlngdesc", label: "Test Lng Desc", field: "testlngdesc" },
  { id: "testCate", label: "Test Cate", field: "testCate" },
  { id: "testCateDesc", label: "Test Cate Desc", field: "testCateDesc" },
  { id: "noOfTimes", label: "No Of Times", field: "noOfTimes" },
  { id: "behaviour", label: "Behaviour", field: "behaviour" },
  { id: "unit", label: "Unit", field: "unit" },
  { id: "comments", label: "Comments", field: "comments" },
];
const tableHeaderValidation = [
  { id: "validRuleNo", label: "Valid Rule No", field: "validRuleNo" },
  { id: "formula", label: "Formula", field: "formula" },
  { id: "operator", label: "Operator", field: "operator" },
  { id: "resultValue1", label: "Result Value 1", field: "resultValue1" },
  { id: "resultValue2", label: "Result Value 2", field: "resultValue2" },
  {
    id: "productOrStepLvl",
    label: "productOrStepLvl",
    field: "productOrStepLvl",
  },
];
const tableHeaderVariable = [
  { id: "stepCode", label: "Step Code", field: "stepCode" },
  { id: "stepDesc", label: "Step Desc", field: "stepDesc" },
  { id: "stepVar", label: "Variable", field: "stepVar" },
  { id: "varValue", label: "Value", field: "varValue" },
];
const tableHeaderEquipments = [
  { id: "eqpTypeCode", label: "Eqp Type Code", field: "eqpTypeCode" },
  { id: "eqpTypeDesc", label: "Eqp Type Desc", field: "eqpTypeDesc" },
  { id: "minimumNo", label: "Minimum No", field: "minimumNo" },
];
