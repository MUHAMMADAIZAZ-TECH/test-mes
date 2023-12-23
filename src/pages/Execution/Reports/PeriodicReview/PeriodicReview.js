import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { AutoComplete, CustomDatePicker, CustomDataGrid, CustomButton } from '../../../../components'
import { Restore, Search } from '@mui/icons-material';

const PeriodicReview = () => {
    const today = new Date(); // Get the current date
    const [selectedDate, setSelectedDate] = useState(today);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4.5}>
                    <AutoComplete width={'100%'} label="Section" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6} lg={4.5}>
                    <Typography sx={{ padding: 1 }}>From</Typography>
                  <Box display="flex" flexDirection="column" justifyContent={'space-between'} gap={2}>
                  <AutoComplete width={'100%'} label="Product" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                      <CustomDatePicker width="100%" label="Date From" value={selectedDate} onChange={handleDateChange}
                        error={false} // true or false
                        required
                        size="small"
                        helperText="Please select a date"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={4.5}>
                    <Typography sx={{ padding: 1 }}>To</Typography>
                    <Box display="flex" flexDirection="column" justifyContent={'space-between'} gap={2}>
                    <AutoComplete width={'100%'} label="Product" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                       <CustomDatePicker width="100%" label="Date To" value={selectedDate} onChange={handleDateChange}
                        error={false} // true or false
                        required
                        size="small"
                        helperText="Please select a date"
                    />
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                    <Box marginTop={5}>
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
            </Grid>
            <Grid container spacing={2} mt={5}>
                <Grid item xs={12}>
                    <CustomDataGrid
                        sx={{ height: 400, }}
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onExportToPDF={()=>console.log("print")}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

const columns = [
    { field: 'mrname', headerName: 'Market Name', flex: 1 },
    { field: 'bulklotno', headerName: 'Bulk Lot Number', flex: 1 },
    { field: 'mprrevision', headerName: 'MPR Revision', flex: 1 },
    { field: 'issuancedate', headerName: 'Issuance Date', flex: 1 },
    { field: 'dateofman', headerName: 'Date of Manufacturing', flex: 1 },
    { field: 'useableyield', headerName: 'Useable Yield %', flex: 1 },
    { field: 'lotdesposition', headerName: 'Lot Desposition', flex: 1 },
    { field: 'dateofdisposition', headerName: 'Date of Desposition', flex: 1 },
    { field: 'comments', headerName: 'Comments', flex: 1 },
]
const rows = [
  { id: 1, mrname: 'Market 1', bulklotno: 'BLN-001', mprrevision: 'Rev 1', issuancedate: '2023-01-01', dateofman: '2023-02-15', useableyield: 95, lotdesposition: 'Disposition 1', dateofdisposition: '2023-03-01', comments: 'First row comments' },
  { id: 2, mrname: 'Market 2', bulklotno: 'BLN-002', mprrevision: 'Rev 2', issuancedate: '2023-02-01', dateofman: '2023-03-15', useableyield: 92, lotdesposition: 'Disposition 2', dateofdisposition: '2023-04-01', comments: 'Second row comments' },
];


export default PeriodicReview;