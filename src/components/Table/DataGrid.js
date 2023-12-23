import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from "./CustomToolBar"; // Import the CustomToolbar component
import { CustomNoRowsOverlay } from "./NoRowsOverlay";
function CustomDataGrid({
  rows,
  columns,
  handleClick,
  setselectedRow,
  onExportToPDF,
  paginationModel,
  rowCount,
  loading,
  onPaginationModelChange,
  setRowModesModel,
  rowModesModel,
  checkboxSelection,
  paginationMode="server",
  pageSizeOptions = [25, 50, 100],
  hideFooterPagination,
  sx={ width: '100%', height: '74vh' },
  hideexport,
  getRowId,
  BtnText
}) {

  return (
    <DataGrid
      sx={sx}
      paginationMode={paginationMode}
      rows={rows || []}
      columns={columns}
      pageSizeOptions={pageSizeOptions}
      checkboxSelection={checkboxSelection}
      onRowSelectionModelChange={(rowSelectionModel) => {
        let filteredrows = rows?.filter((row) => rowSelectionModel.includes(row.id));
        setselectedRow(filteredrows)
      }}
      disableRowSelectionOnClick
      rowModesModel={rowModesModel}
      onRowModesModelChange={(newRowModesModel) => {
        setRowModesModel(newRowModesModel);
      }}
      slots={{ 
        toolbar: CustomToolbar, 
        noRowsOverlay: CustomNoRowsOverlay 
      }}
      slotProps={{
        toolbar: {
          handleClick,
          exportToPDF: onExportToPDF,
          hideexport,
          BtnText
        }
      }}
      getRowId={getRowId}
      hideFooterPagination={hideFooterPagination}
      paginationModel={paginationModel}
      rowCount={rowCount}
      loading={loading}
      onPaginationModelChange={onPaginationModelChange}
    />
  );
}

export default CustomDataGrid;
