import { Grid, Paper, Box, } from '@mui/material'
import React, { useState } from 'react'
import { CustomButton, AutoComplete, CustomDataGrid, TreeView } from '../../../../components'

const MprInquriy = () => {
  const [selectedData, setSelectedData] = useState({
    product: {},
    template: {},
  });
  const [currentSelection, setCurrentSelection] = useState({
    type:'stage'
  });

  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Product" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Section" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Batch No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
          <CustomButton variant="text">
            Product Documents/Uploaded Documents
          </CustomButton>
          <CustomButton variant="text">
            Batch Event History
          </CustomButton>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 5, flexGrow: 1 }}>
        <Grid
          display="flex"
          alignItems="flex-start"
          container
          spacing={2}
        >
          <Grid item xs={3.5}>
            <Box
              sx={{
                borderRadius: 1,
                paddingX: 2,
                backgroundColor: "#dcdde6",
                border: "1px solid lightgray",
              }}
            >
              <TreeView
                data={selectedData.template}
                onSelectLevel={() => console.log("Select Level")}
              />
            </Box>
          </Grid>
          <Grid item xs={8.5}>
            {currentSelection.type === "stage" ? (
              <Box
                sx={{
                  borderRadius: 1,
                  paddingY: 1,
                  paddingX: 1,
                  border: "1px solid lightgray",
                  minHeight: "550px",
                  maxHeight: "550px",
                  overflow: "auto",
                }}
              >
                <CustomDataGrid
                  sx={{ height: 400, }}
                  rows={rows}
                  columns={columns}
                  hideexport
                  hideFooterPagination
                />
              </Box>
            ) : currentSelection.type === "unitOp" ? (
              <Box
                sx={{
                  borderRadius: 1,
                  paddingY: 1,
                  paddingX: 1,
                  border: "1px solid lightgray",
                  maxHeight: "550px",
                  minHeight: "550px",
                  overflow: "auto",
                }}
              >  <CustomDataGrid
                  sx={{ height: 400, }}
                  rows={rows}
                  columns={columns}
                  hideexport
                  hideFooterPagination
                />

              </Box>
            ) : currentSelection.type === "step" ? (
              <Box
                sx={{
                  borderRadius: 1,
                  paddingY: 1,
                  paddingX: 1,
                  border: "1px solid lightgray",
                  minHeight: "550px",
                  maxHeight: "550px",
                  overflow: "auto",
                }}
              >
                <CustomDataGrid
                  sx={{ height: 400, }}
                  rows={rows}
                  columns={columns}
                  hideexport
                  hideFooterPagination
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
const columns = [
  { field: 'prodcode', headerName: 'Product Code', flex: 1 },
  { field: 'prodname', headerName: 'Product Name', flex: 1 },
  { field: 'batchno', headerName: 'Batch#', flex: 1 },
  { field: 'initiated', headerName: 'Initiated', flex: 1 },
  { field: 'assignmaterials', headerName: 'Assign Materials', flex: 1 },
  { field: 'assignareas', headerName: 'Assign Areas', flex: 1 },
  { field: 'lineclr', headerName: 'Line Clearance', flex: 1 },
  { field: 'pharmacyweighing', headerName: 'Ph. Weighing', flex: 1 },
  { field: 'exec', headerName: 'Execution', flex: 1 },
  { field: 'dom', headerName: 'DOM', flex: 1 },
  { field: 'batchclosure', headerName: 'Batch Closure', flex: 1 }
]
const rows = [
  {
    id: "1",
    prodcode: "0804",
    prodname: "product-0804",
    batchno: "1",
    initiated: "No",
    assignmaterials: "Yes",
    assignareas: "No",
    lineclr: "Yes",
    pharmacyweighing: "No",
    exec: "No",
    dom: "Yes",
    batchclosure: "Yes",
  },
  {
    id: "2",
    prodcode: "0804",
    prodname: "product-0804",
    batchno: "2",
    initiated: "Yes",
    assignmaterials: "No",
    assignareas: "Yes",
    lineclr: "No",
    pharmacyweighing: "Yes",
    exec: "Yes",
    dom: "No",
    batchclosure: "Yes",
  },
];
export default MprInquriy