import React from 'react'
import { AutoComplete, ActionButtons, CustomDataGrid, Accordion } from '../../../../components'
import { Box, Grid, Paper, Typography } from '@mui/material';
const ManufacturingDemo = () => {
  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Product" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Section" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Batch No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Stage" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Unit Operation" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Step No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Accordion
            title="Safety Instruction"
            childComponent={
              <Grid item xs={12}>
                <Box>
                  <Typography>Prepare a tared container to collect waste. label with attachment C</Typography>
                  <Typography>Special Instruction: N/A (not applicable)</Typography>
                  <Typography>Tare. Wt =20 Kg</Typography>
                </Box>
              </Grid>
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <CustomDataGrid
            hideFooterPagination
            sx={{ height: 400, }}
            rows={rows}
            columns={columns}
            checkboxSelection
            hideexport
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <ActionButtons
          loading={false}
          onClose={() => console.log('Console')}
          onSubmit={() => console.log('Console')}
        />
      </Grid>

    </Paper>
  )
}

const columns = [
  { field: 'area', headerName: 'Area', flex: 1 },
  { field: 'areadesc', headerName: 'Description', flex: 1 },
]
const rows = [
  {
    id: "1",
    area: "Building 1 - room 2/3",
    areadesc: "Non-containment",
  },
  {
    id: "2",
    area: "Building 2 - room 2/3",
    areadesc: "containment",
  },
];
export default ManufacturingDemo;