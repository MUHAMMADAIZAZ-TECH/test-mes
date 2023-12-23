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
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { AddBox, Delete, Edit, DragIndicator } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

const CustomTableCell = styled(TableCell)({
  lineHeight: 1,
  padding: 12,
  cursor: "pointer",
});

const CustomTableReorder = ({
  data,
  tableHeader,
  onRowSelect,
  handleCloseModal,
  showCheckBox = true,
  showAddButton = false,
  showDeleteButton = false,
  showUpdateButton = false,
  onAdd,
  onDelete,
  onUpdate,
  containerStyles,
  onCheckboxChange,
  onReorder,
  addTooltip,
}) => {
  const [tableData, setTableData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const onSelectTableCell = (row) => {
    if (onRowSelect) {
      onRowSelect(row);
      setSelectedRow(row);
      handleCloseModal && handleCloseModal();
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, endIndex) => {
    e.preventDefault();
    const startIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (onReorder && startIndex !== endIndex) {
      const reorderedData = [...tableData];
      const [movedRow] = reorderedData.splice(startIndex, 1);
      reorderedData.splice(endIndex, 0, movedRow);
      setTableData(reorderedData);
      onReorder(reorderedData);
    }
  };

  return (
    tableData && (
      <TableContainer
        sx={{ width: "100%", ...containerStyles }}
        component={Paper}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
            <TableRow>
              {showCheckBox && <CustomTableCell></CustomTableCell>}
              {tableHeader.map((column) => (
                <CustomTableCell key={column.id}>
                  {column.label}
                </CustomTableCell>
              ))}
              {(onReorder || onDelete || onUpdate || onAdd) && <CustomTableCell align="right">Action</CustomTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow
                key={row.name}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {showCheckBox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={row === selectedRow}
                      onChange={() => {
                        onSelectTableCell(row);
                      }}
                    />
                  </TableCell>
                )}
                {tableHeader.map((column) => (
                  <CustomTableCell key={column.id} component="th" scope="row">
                    {column.type === "checkbox" ? (
                      <Checkbox
                        checked={row[column.id]}
                        onChange={(event) => {
                          if (onCheckboxChange) {
                            onCheckboxChange(row, column.id, event.target.checked);
                          }
                        }}
                      />
                    ) : (
                      row[column.field]
                    )}
                  </CustomTableCell>
                ))}
                <CustomTableCell>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {showAddButton && (
                      <Tooltip title={addTooltip || "Add"}>
                        <IconButton size="small" onClick={() => onAdd(row, index)}>
                          <AddBox fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {showUpdateButton && (
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onUpdate(row, index)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {showDeleteButton && (
                      <Tooltip title="Remove">
                        <IconButton size="small" onClick={() => onDelete(row, index)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onReorder && (
                      <Tooltip title="Reorder">
                        <IconButton size="small" draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e)}
                          onDrop={(e) => handleDrop(e, index)}>
                          <DragIndicator fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default CustomTableReorder;
