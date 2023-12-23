import { Grid, Paper } from '@mui/material'
import React from 'react'
import { AutoComplete, InputField, ActionButtons } from '../../../../components'

const PharmacyWeighingRemoval = () => {
  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Reference No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={0.5}>
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
      </Grid>
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12}>
          <InputField multiline rows={5} fullWidth label={'Reason'} />
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

export default PharmacyWeighingRemoval;
