import React from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from "../../../../components/Layout/List";
import { useNavigate } from "react-router-dom";
import { deleteProVar } from "./Apis";

const ProductVariableList = ({ url }) => {
    const navigate = useNavigate();
    const [handleAction, handleSnackbarOpen] = useOutletContext();

    const onClickUpdate = (row) => {
    navigate(
     `/base/product-mpr/step-product-variable/edit?sec_id=${'FG'}&prod_id=${row.prodCode}&temp_id=${row.tempCode}&step_cat=${row.stepCategory}`);
    };

    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        exportToPDFFunction={exportToPDF}
                        url={url}
                        deleteFunction={deleteProVar}
                        EditFunction={onClickUpdate}
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProductVariableList;