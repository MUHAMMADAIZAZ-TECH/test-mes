import { Grid, Paper,Box,Typography,Stack } from '@mui/material'
import React from 'react'
import { CustomButton, AutoComplete, CustomDataGrid } from '../../../../components'
import { Search,Close } from '@mui/icons-material'
const BatchesInManufacturing = () => {
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
                    <AutoComplete width={'100%'} label="Product" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4.5}>
                    <Typography sx={{ padding: 1 }}>To</Typography>
                    <AutoComplete width={'100%'} label="Product" options={[]}
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
                                startIcon={<Close />}
                            >
                                Cancel
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
                    />
                </Grid>
            </Grid>
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
export default BatchesInManufacturing;