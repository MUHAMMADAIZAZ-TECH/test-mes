import React, { useState } from "react";
import { Box, Grid } from '@mui/material';
import { exportToPDF, GenerateColumns } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from "../../../../components/Layout/List";
import { CustomModal, SelectTemplateStage } from "../../../../components";

const initialState = {
    "prodcode": "",
    "prodshtname": "",
    "prodlngname": "",
    "prodcatecode": "",
    "prodcatedesc": "",
    "registrationno": "",
    "batchsize": "",
    "status": "",
    "storagecon": "",
    "unit": "",
    "lastuser": "",
    "lastupdate": "",
    "createdby": "",
    "createdon": "",
    "description": "",
    "controlSubstance": "",
    "controlSubDesc": "",
    "prodComments": "",
    "partialPh": "",
    "uoPE": "",
    "section": {
        "id": "",
        "sectionCode": "",
        "sectionDesc": "",
        "createdBy": "",
        "createdOn": "",
        "lastUser": "",
        "lastUpdate": "",
        "tenantId": "1038",
        "sectionpk": "",
        "_etag": "",
        "isdeleted": false,
        "clientInfoReqd": "",
        "expiryDateReqd": "",
        "applicableForProduct": ""
    },
    "customerCode": "",
    "customerDesc": "",
    "expiryMonth": "",
    "tenantId": "",
    "productpk": "",
    "_etag": "",
    "isdeleted": false
}
const MasterFormulaList = ({ url }) => {
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
                            screen="masterFormula"
                        />
                    }
                    width={650}
                    height={680}
                />
            </Grid>
        </Box>
    )
}

export default MasterFormulaList;