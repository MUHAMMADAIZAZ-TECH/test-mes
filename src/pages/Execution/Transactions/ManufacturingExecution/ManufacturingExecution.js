import React from 'react'
import { AutoComplete, ActionButtons, CustomDataGrid, Accordion, InputField, CustomButton, CustomCheckbox } from '../../../../components'
import { Box, Grid, Paper, Typography } from '@mui/material';
const ManufacturingExecution = () => {
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
          <ActionButtons
            containerStyle={{ margin: 0,display:'flex',justifyContent:'flex-end' }}
            loading={false}
            onClose={() => console.log('Console')}
            onSubmit={() => console.log('Console')}
          />
        </Grid>
        <Grid item xs={12}>
          <Accordion
            title="Safety Instruction"
            childComponent={
              <Grid item xs={12}>
                <Box>
                  <Typography> A) Wear protective hood, respirator, and proper attire before handling raw materials and product, per SOP 10.137. </Typography>
                  <Typography> B) Perform operations in a containment suite.</Typography>
                  <Typography> C) Refer to Safety Assessment for Progesterone.</Typography>
                  <Typography> 	Reconciliation of Blend
                    Note: Any discrepancy from established limits must be reported to your Supervisor and QA. Any discrepancy must be appropriately investigated and documented.</Typography>
                </Box>
              </Grid>
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        {Items.map((item, key) => (
            <Grid item key={key} lg={4} md={4} sm={6} xs={12}>
              <InputField value={item.Value} label={item.label} fullWidth/>
            </Grid>
          ))}
        </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item lg={10} md={8} sm={12} xs={12}>
          <Box display={'flex'} justifyContent={'space-between'} sx={{ margin: 1 }}>
            <Typography>(Accountable Yield (Blend))</Typography>
            <Typography>b/w	95 and 101</Typography>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} sx={{ margin: 1 }}>
            <Typography>(Usable Yield (Blend))</Typography>
            <Typography>b/w	90 and 101</Typography>
          </Box>
        </Grid>
        <Grid item lg={2} md={4} xs={12} sm={12}>
          <Box display="flex" justifyContent='flex-end'>
          <CustomButton>Perform Validation</CustomButton>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <CustomDataGrid
            hideFooterPagination
            sx={{ height: 'auto', }}
            rows={rows}
            columns={columns}
            checkboxSelection
            hideexport
          />
        </Grid>
      </Grid>
      <Grid component={Paper} container p={2} mt={2}>
        <Box display={'flex'} flexDirection={'column'}>
      <Typography variant='h5' mb={2}>Safety Instruction</Typography>
          <Typography> Label</Typography>
          <CustomCheckbox checked={true} label={"I have read the Safety Instruction carefully."}/>
          <Box>
          <InputField label={"Enter Password"} />
          <CustomButton>OK</CustomButton>
          </Box>
        </Box>
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
  { field: 'areadcode', headerName: 'Area Code', flex: 1 },
  { field: 'area', headerName: 'Area', flex: 1 },
]
const Items = [
  { label: 'Theoretical weight of blend', Value: '260.000' },
  { label: 'Actual weight of blend', Value: '260.000' },
  { label: 'Samples', Value: '260.000' },
  { label: 'Samples (Additional 1)', Value: '260.000' },
  { label: 'Waste/Rejects', Value: '260.000' },
  { label: 'Waste/Rejects (Additional 1)', Value: '260.000' },
  { label: 'Other', Value: '260.000' },
  { label: 'Other (Additional 1)', Value: '260.000' },
  { label: 'Other (describe)', Value: '260.000' },
  { label: 'Theoretical weight of excess granules', Value: '260.000' },
  { label: 'Accountable Yield (Blend)', Value: '260.000' },
  { label: 'Usable Yield (Blend)', Value: '260.000' },
]
const rows = [
  {
    id: "1",
    areadcode: "A-65",
    area: "Building 1 - room 2/3",
  },
  {
    id: "2",
    areadcode: "A-6235",
    area: "Building 2 - room 2/3",
  },
];
export default ManufacturingExecution;