import React, { useState } from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns, initialState } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from "../../../../components/Layout/List";
import { CustomModal, SelectTemplateStage } from "../../../../components";

const IngredientAdjustmentList = ({ url }) => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    const [product, setProduct] = useState(initialState);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setProduct({});
        setOpenModal(false);
    };

    const onClickUpdate = (row) => {
        setProduct(row);
        handleOpenModal();
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
                        code='prodcode'
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
                <CustomModal
                    open={openModal}
                    onClose={handleCloseModal}
                    content={
                        <SelectTemplateStage
                            data={product}
                            onCloseModal={handleCloseModal}
                            screen="ingredientAdjustment"
                        />
                    }
                    width={650}
                    height={680}
                />
            </Grid>
        </Box>
    )
}

export default IngredientAdjustmentList;