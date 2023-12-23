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
import { InputField } from "../../../../components";

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
  stickyHeader,
  assignedList
}) => {
  const [tableData, setTableData] = useState([]);

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
    if (!Object.prototype.hasOwnProperty.call(row, 'comments')) {
      row.comments = e.target.value;
    } else {
      row.comments = e.target.value;
    }
    setTableData(newData);
  };
  const FindSame = () => {
    const combinedArray = data.map((area) => {
      const correspondingUser = assignedList?.find((user) => user.areaCode === area.areaCode);
      return {
        ...area,
        ...correspondingUser,
        checked: correspondingUser ? true : false,
      };
    });
  
    return combinedArray;
  };
  useEffect(() => {
    setTableData(FindSame());
  }, [data]);

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
                    {column.id === "comments" ? (
                      <InputField
                        name={column.id}
                        value={row.comments}
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
