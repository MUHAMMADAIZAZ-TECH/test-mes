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
import { AddBox, Delete, Edit, Download, Info } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { DateTime } from 'luxon';

const CustomTableCell = styled(TableCell)({
  lineHeight: 1,
  padding: 12,
  cursor: "pointer",
});

const CustomTable = ({
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
  addTooltip,
  onCheckboxChange,
  showDownloadButton = false,
  onDownload,
  stickyheader,
  onView
}) => {
  const [tableData, setTableData] = useState([]);
  
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const onSelectTableCell = (row) => {
    if (onRowSelect) {
      const newSelectedRow = selectedRow === row ? null : row;
      onRowSelect(newSelectedRow);
      setSelectedRow(newSelectedRow);
      handleCloseModal && handleCloseModal();
    }
  };


  return (
    tableData && (
      <Table stickyHeader={stickyheader}>
       <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
          <TableRow>
            {showCheckBox && <CustomTableCell></CustomTableCell>}
            {tableHeader.map((column) => (
              <CustomTableCell key={column.id}>
                {column.label}
              </CustomTableCell>
            ))}
            <CustomTableCell></CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
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
                          onCheckboxChange(
                            row,
                            column.id,
                            event.target.checked
                          );
                        }
                      }}
                    />
                  ) : (
                    // Check if the column has a 'format' property for date formatting
                    column.format && column.field === 'eDate' ?
                      DateTime.fromISO(row[column.field]).toLocaleString(column.format) :
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
                      <IconButton size="small" onClick={() => onAdd(row)}>
                        <AddBox fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {showUpdateButton && (
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onUpdate(row, index)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {showDeleteButton && (
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(row, index)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {showDownloadButton && (
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => onDownload(row, index)}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onView && (
                    <Tooltip title="View Detail">
                      <IconButton
                        size="small"
                        onClick={() => onView(row, index)}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
};

const withPaperWrapper = (Component) => ({ paper, maxHeight, minHeight, ...props }) => (
  paper ? <Component {...props} /> : <TableContainer sx={{ width: "100%", maxHeight, minHeight }} component={Paper}><Component {...props} /></TableContainer>
);
export default withPaperWrapper(CustomTable);
