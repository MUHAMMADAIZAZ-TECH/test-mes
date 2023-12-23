import React from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns, DeleteRemoveStep } from './Apis';
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import List from '../../../../components/Layout/List';

const RemoveStepList = ({ url }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [handleAction, handleSnackbarOpen] = useOutletContext();

    const onClickUpdate = (row) => {
        navigate(`${pathname}/edit?sec=${row.sectionCode}&prod=${row.productCode}&bat=${row.batchNo}&stg=${row.stageCode}&stglvl=${row.stgLvlNo}&uo=${row.uoCode}&uolvl=${row.uoLvl}&stp=${row.stepcode}&stpLvl=${row.stpLvl}`);
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
                        deleteFunction={DeleteRemoveStep}
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default RemoveStepList;