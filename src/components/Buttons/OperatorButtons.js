import React from "react";
import { CustomButton } from "./Buttons";

const OperatorsAndFunctionsButtons = ({ appendFormula ,buttons}) => {
  return (
    <>
      {buttons.map((label) => (
        <CustomButton
          key={label}
          backgroundColor="#3498DB"
          variant="contained"
          onClick={() => appendFormula(label)}
          sx={{ marginLeft: "5px", marginTop: "5px" }}
        >
          {label}
        </CustomButton>
      ))}
    </>
  );
};

export default OperatorsAndFunctionsButtons;
