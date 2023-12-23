import React from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns } from './Apis';
import { useOutletContext, useNavigate } from "react-router-dom";
import List from "../../../../components/Layout/List";

const MprGenerationList = ({ url }) => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    const navigate = useNavigate();
    const onClickUpdate = (row) => {
        navigate(
            `/base/product-mpr/mpr-generation/edit?sec_id=${row.sectionCode}&prod_id=${row.prodcode}&temp_id=${row.tempCode}&sec_des=${row.secDesc}&prod_des=${row.prodDesc}&temp_des=${row.tempDesc}`);
    };
    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        url={url}
                        exportToPDFFunction={exportToPDF}
                        deleteFunction={false}
                        EditFunction={onClickUpdate}
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default MprGenerationList;