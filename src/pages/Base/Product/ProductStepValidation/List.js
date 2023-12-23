import React from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from "../../../../components/Layout/List";
import { useNavigate } from "react-router-dom";
import { deleteStepValInList } from "./Apis";

const ProductStepValidationList = ({ url }) => {
    const navigate = useNavigate();
    const [handleAction, handleSnackbarOpen] = useOutletContext();

    const onClickUpdate = (row) => {
    navigate(
     `/base/product-mpr/product-level-step-validation/edit?sec_id=${row.sectionCode}&prod_id=${row.productCode}&temp_id=${row.tempCode}&step_code=${row.stepCode}`);
    };

    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        exportToPDFFunction={exportToPDF}
                        url={url}
                        deleteFunction={deleteStepValInList}
                        EditFunction={onClickUpdate}
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProductStepValidationList;