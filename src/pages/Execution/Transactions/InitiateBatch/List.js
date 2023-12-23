import React from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns } from './Apis';
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import List from '../../../../components/Layout/List';

const InitiateBatchList = ({ url }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [handleAction, handleSnackbarOpen] = useOutletContext();

    const onClickUpdate = (row) => {
        navigate(`${pathname}/edit?sec=${row.sectioncode}&prod=${row.productCode}&bat=${row.batchNo}&tem=${row.templateCode}`);
    };
    const onClickAssignMaterial = (row) => {
        navigate(`/execution/transactions/assign-material/edit?sec=${row.sectioncode}&prod=${row.productCode}&bat=${row.batchNo}&tem=${row.templateCode}`);
    };
    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        url={url}
                        exportToPDFFunction={exportToPDF}
                        EditFunction={onClickUpdate}
                        OtherAction={onClickAssignMaterial}
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default InitiateBatchList;