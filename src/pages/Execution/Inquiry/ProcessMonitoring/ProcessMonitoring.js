import { Grid, Paper, Box, Typography, Stack } from '@mui/material'
import React from 'react'
import { CustomButton, AutoComplete, CustomDataGrid,CustomCheckbox, InputField } from '../../../../components'
import { Search, Restore } from '@mui/icons-material'
const ProcessMonitoring = () => {
  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4.5}>
          <Typography sx={{ padding: 1 }}>From</Typography>
          <AutoComplete width={'100%'} label="Room No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4.5}>
          <Typography sx={{ padding: 1 }}>To</Typography>
          <AutoComplete width={'100%'} label="Room No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={3}>
          <Box mt={5}>
            <Stack spacing={1} direction="row" justifyContent={"flex-end"}>
              <CustomButton
                backgroundColor="#28B463"
                variant="contained"
                startIcon={<Search />}
              >
                Search
              </CustomButton>
              <CustomButton
                backgroundColor="#E74C3C"
                variant="contained"
                startIcon={<Restore />}
              >
                Reset
              </CustomButton>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} lg={6}>
        <CustomCheckbox checked={true} label={"Dont display rooms where there is not activity in last"}/>
        </Grid>
        <Grid item xs={12} md={4} lg={6}>
        <InputField label={"Day(s)"}/>
        </Grid>
        <Grid item xs={0} md={0} lg={4}/>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomDataGrid
            sx={{ height: 400 }}
            rows={rows}
            columns={columns}
            checkboxSelection
            hideexport
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

const columns = [
  { field: 'product', headerName: 'Product', flex: 1 },
  { field: 'batch', headerName: 'Batch', flex: 1 },
  { field: 'lastactivity', headerName: 'Last Activity', flex: 1 },
  { field: 'step', headerName: 'Step', flex: 1 },
  { field: 'stage', headerName: 'Stage', flex: 1 },
  { field: 'unitop', headerName: 'Unit Operation', flex: 1 },
]
const rows = [
  {
    id: "1",
    product: "product-0804",
    batch: "batch-0804",
    lastactivity: "No",
    step: "Yes",
    stage: "No",
    unitop: "Yes",
  },
  {
    id: "2",
    product: "product-0804",
    batch: "batch-0804",
    lastactivity: "No",
    step: "Yes",
    stage: "No",
    unitop: "Yes",
  },
];
export default ProcessMonitoring;