import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { CustomButton, InputField } from "../../../../components";

const CustomTableCell = styled(TableCell)({
  lineHeight: 1,
  padding: 12,
  cursor: "pointer",
});

const CustomTableMultipleRow = ({
  data,
  tableHeader,
  onRowSelect,
  showCheckBox = true,
  maxHeight,
  minHeight,
  selectedRows,
  setSelectedRows,
}) => {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const onSelectTableCell = (row) => {
    let updatedSelectedRows;

    if (selectedRows.includes(row)) {
      updatedSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow !== row
      );
    } else {
      updatedSelectedRows = [...selectedRows, row];
    }
    setSelectedRows(updatedSelectedRows);
    if (onRowSelect) {
      onRowSelect(updatedSelectedRows);
    }
  };

  const handleInput = (e, index) => {
    const newData = [...tableData];
    const row = newData[index];
    row[e.target.name] = e.target.value;
    setTableData(newData);
  };
  const onCalculate = (row,index) =>{
    console.log(row,index);
  }
  return (
    tableData && (
      <TableContainer
        sx={{ width: "100%", maxHeight, minHeight }}
        component={Paper}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
            <TableRow>
              {tableHeader.map((column) => (
                <CustomTableCell key={column.id}>
                  {column.label}
                </CustomTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={row.name}>
                {showCheckBox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(row)}
                      onChange={() => {
                        onSelectTableCell(row);
                      }}
                    />
                  </TableCell>
                )}
                {tableHeader.map((column) => (
                  <CustomTableCell key={column.id} width={column.width}>
                    {column.id === "calButton" &&  row.tctd !=="RawData"? (
                        <CustomButton onClick={()=>onCalculate(row,index)}>
                        Calculate
                        </CustomButton>
                    ) 
                    :column.id === "comments" || column.id==='adj'? (
                      <InputField
                        multiline={column.id === "comments"}
                        rows={column.id === "comments"?2:1}
                        name={column.id}
                        value={row[column.id]}
                        onChange={(e) => handleInput(e, index)}
                        fullWidth
                      />
                    ) : (
                      row[column.field]
                    )}
                  </CustomTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default CustomTableMultipleRow;
