import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { AutoComplete, CustomDatePicker, CustomDataGrid, CustomButton } from '../../../components'
import { Close, Search } from '@mui/icons-material';

const Listing = () => {
    const today = new Date(); // Get the current date
    const [selectedDate, setSelectedDate] = useState(today);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} lg={5}>
                    <AutoComplete width={'100%'} label="Listing Of" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <AutoComplete width={'100%'} label="Section" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                    <Box>
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
                                startIcon={<Close />}
                            >
                                Cancel
                            </CustomButton>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6} lg={6}>
                    <Typography sx={{ padding: 1 }}>From</Typography>
                   <Box display='flex' flexDirection="column" justifyContent="space-between" gap={2}>
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
                <Grid item xs={12} md={6} lg={6}>
                    <Typography sx={{ padding: 1 }}>To</Typography>
                    <Box display='flex' flexDirection="column" justifyContent="space-between" gap={2}>
                    <AutoComplete width={'100%'} label="Batch" options={[]}
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
            </Grid>
            <Grid container spacing={2} mt={5}>
                <Grid item xs={12}>
                    <CustomDataGrid
                        sx={{ height: 400, }}
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

const columns = [
    { field: 'product', headerName: 'Product', flex: 1 },
    { field: 'section', headerName: 'Section', flex: 1 },
    { field: 'batchno', headerName: 'Batch No', flex: 1 },
    { field: 'stage', headerName: 'Stage', flex: 1 },
    { field: 'uniop', headerName: 'Unit Op', flex: 1 },
    { field: 'set#', headerName: 'set#', flex: 1 },
    { field: 'value', headerName: 'Value', flex: 1 },
    { field: 'lineclr', headerName: 'Line Clearance', flex: 1 },
    { field: 'comments', headerName: 'Comments', flex: 1 },
]
const rows = [
    { id: 1, product: 'Product A', section: 'Section 1', batchno: 'Batch 001', stage: 'Stage 1', uniop: 'Unit Op 1', 'set#': 1, value: 10, lineclr: 'LC001', comments: 'Row 1 Comment' },
    { id: 2, product: 'Product B', section: 'Section 2', batchno: 'Batch 002', stage: 'Stage 2', uniop: 'Unit Op 2', 'set#': 2, value: 15, lineclr: 'LC002', comments: 'Row 2 Comment' },
];

export default Listing;