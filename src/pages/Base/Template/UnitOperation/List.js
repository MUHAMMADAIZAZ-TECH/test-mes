import React from "react";
import { Box, Grid } from '@mui/material';
import { deleteUnitOpr, exportToPDF, GenerateColumns } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from '../../../../components/Layout/List';

const UnitOpList = ({ url }) => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
        <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={12}>
                <List
                    generateColumns={GenerateColumns}
                    url={url}
                    exportToPDFFunction={exportToPDF}
                    deleteFunction={deleteUnitOpr}
                    code='mpUnitCode'
                    handleSnackbarOpen={handleSnackbarOpen}
                    handleAction={handleAction}
                />
            </Grid>
        </Grid>
    </Box>
    )
}

export default UnitOpList;