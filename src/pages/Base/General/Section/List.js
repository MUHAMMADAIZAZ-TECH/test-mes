import React from "react";
import { Box, Grid } from '@mui/material';
import {
    exportToPDF, GenerateColumns, deleteSection,
} from './Apis';
import { useOutletContext } from "react-router-dom";
import List from "../../../../components/Layout/List";

const SecList = ({ url }) => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        exportToPDFFunction={exportToPDF}
                        deleteFunction={deleteSection}
                        url={url}
                        code='sectionCode'
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default SecList;