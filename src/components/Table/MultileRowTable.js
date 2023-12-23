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
import { InputField } from "../index";

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
  stickyHeader
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

  const handleCommentsChange = (e, index) => {
    const newData = [...tableData];
    const row = newData[index];
    if (!Object.prototype.hasOwnProperty.call(row, e.target.name)) {
      row[e.target.name] = e.target.value;
    } else {
      row[e.target.name] = e.target.value;
    }
    setTableData(newData);
  };
  
  return (
    tableData && (
      <TableContainer
        sx={{ width: "100%", maxHeight, minHeight }}
        component={Paper}
      >
        <Table stickyHeader={stickyHeader}>
          <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
            <TableRow>
              <CustomTableCell></CustomTableCell>
              {tableHeader.map((column) => (
                <CustomTableCell key={column.id}>
                  {column.label}
                </CustomTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                {showCheckBox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(row) || row.checked}
                      onChange={() => {
                        onSelectTableCell(row);
                      }}
                    />
                  </TableCell>
                )}
                {tableHeader.map((column) => (
                  <CustomTableCell key={column.id} width={column.width}>
                    {column.id === "comments" || column.id === "testVal" ? (
                      <InputField
                        name={column.id}
                        // disabled={!selectedRows.includes(row)}
                        value={row[column.id]}
                        onChange={(e) => handleCommentsChange(e, index)}
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
