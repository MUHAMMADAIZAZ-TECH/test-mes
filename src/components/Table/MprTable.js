import React from "react";
import CustomTable from "./CustomTable";

const MprTable = ({ data, header }) => {
  return (
    <CustomTable
      data={data}
      tableHeader={header}
      showCheckBox={false}
      containerStyles={{
        maxWidth: "1000px",
      }}
    />
  );
};

export default MprTable;
