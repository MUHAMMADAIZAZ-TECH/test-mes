import React from "react";
import { Box, Grid } from '@mui/material';
import { GenerateColumns, deleteBatchStatus, exportToPDF } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from "../../../../components/Layout/List";
const BatchStatusList = () => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        url='batchStatus'
                        exportToPDFFunction={exportToPDF}
                        deleteFunction={deleteBatchStatus}
                        code='batchStatusCode'
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default BatchStatusList