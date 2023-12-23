import React from "react";
import CustomTable from "../../../components/Table/CustomTable";

const MprAreaTypes = ({ areaTypes }) => {
  return (
    <CustomTable
      data={areaTypes.basicAreaTypeClasses}
      tableHeader={tableHeader}
      showCheckBox={false}
    />
  );
};

const tableHeader = [
  { id: "areaTypeCode", label: "Area Type Code", field: "areaTypeCode" },
  { id: "areaTypeDesc", label: "Area Type Desc", field: "areaTypeDesc" },
  { id: "lcCode", label: "L.C. Code", field: "lcCode" },
  { id: "lcDesc", label: "L.C. Desc", field: "lcDesc" },
  { id: "lcReqd", label: "L.C. Reqd", field: "lcReqd" },
];
export default MprAreaTypes;
