import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ActionButtons, CustomActionButtons, DescriptionHeader } from '../../../../components'
import ProductForm from '../../ProductForm';
import {
    fetchIngredientAdjCalc, initialState, fetchAssignBatchToProduct,
    fetchTemplateDetails,fetchIngredientAdjustmentOptions
} from './Apis';
import { DateTime } from 'luxon';
import { fetchProductBatches } from '../Apis'
import CustomTableMultipleRow from './adjustments';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const IngredientAdjustment = ({label}) => {
    const EditMode = label.startsWith("Edit") || false
    const [config, setconfig] = useState({ loading: false, Found: false });
    const [searchparams, setSearchParams] = useSearchParams();
    const [state, setState] = useState({
        ...initialState,
        sectionCode: searchparams.get('sec') || "",
        prodcode: searchparams.get('prod') || "",
        batchNo: searchparams.get('bat') || "",
        tempCode: searchparams.get('tem') || "",
        stageCode: searchparams.get('stg') || "",
    })
    const [productBatches, setproductBatches] = useState([]);
    const { ProductMpr } = useSelector((state) => {
        return {
            ProductMpr: state.Mpr.ProductMpr
        };
    });
    const handleSubmit = () => {

    }
    const handleInput = (e, object) => {
        const { name, value } = e.target;
        const updates = { [name]: value || '' };
        if (name === 'prodcode' && value) {
            productSelection(value, object);
        }
        else if (name === 'batchNo' && value) {
            setState((prev) => ({ ...prev, stageCode: "", areaList: [] }));
            fetchAssignBatchToProduct(state, value, setState)
        }
        if (name === 'stageCode') {
            setState((prev) => ({ ...prev, stage: object }));
            fetchIngredientAdjustmentOptions(state,setState)
        }

        setState((prev) => ({ ...prev, ...updates, }));
    };
    const productSelection = (prodcode, product) => {
        setState((prev) => ({ ...prev, sectionCode: product.sectionCode || "", tempCode: product.tempCode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
        fetchTemplateDetails({ ...state, sectionCode: product.sectionCode || "", tempCode: product.tempCode, prodcode }, setState)
    };
    const handleSearch = () => {
        if (state.batchNo && state.prodcode && state.sectionCode && state.stageCode && state.adjOptCode) {
            fetchIngredientAdjCalc(state, setState, setconfig)
        }
    };
    const handleReset = () => {
        setconfig((prev) => ({ ...prev, Found: false }))
        setState(initialState);
    }
    useEffect(() => {
        if (EditMode) {
            handleSearch()
            fetchIngredientAdjustmentOptions(state,setState)
            fetchTemplateDetails(state, setState)
        }
    }, [])
    console.log(state);
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <ProductForm
                    stage
                    option
                    handleInput={handleInput}
                    productBatches={productBatches}
                    products={ProductMpr || []}
                    state={state}
                    EditMode={EditMode}
                    setState={setState}
                    config={config}
                />
            </Grid>
            {config.Found === true && (
                <>
                    <Grid container spacing={2} mt={3}>
                        {state?.Template && state?.batchDetails?.initiateDate && (
                            <Grid item xs={12}>
                                <DescriptionHeader sx={{ backgroundColor: "#4b9dea" }}>
                                    <Box display='flex' justifyContent='space-between' color='white'>
                                        <Typography>
                                            Template: {`${state?.RequestBody?.tempCode} - ${state?.RequestBody?.tempDesc}`}
                                        </Typography>
                                        <Typography>
                                            Batch Size: {state?.RequestBody?.batchSize}
                                        </Typography>
                                        <Typography>
                                            Batch Initiate Date: {DateTime.fromISO(state?.RequestBody?.batchIniDate).toFormat('dd-MMMM-yyyy')}
                                        </Typography>
                                    </Box>
                                </DescriptionHeader>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container item xs={12}>
                        <CustomTableMultipleRow
                            showCheckBox={false}
                            data={state?.IngList?.listIngredientAdjustment || []}
                            tableHeader={columns2}
                        // showDeleteButton
                        // onDelete={handleRemoveEquipment}
                        />
                    </Grid>
                </>
            )}
            <Grid item xs={12}>
                <ActionButtons
                    loading={config.loading}
                    onClose={handleReset}
                    onSubmit={handleSubmit}
                    Found={config.Found}
                    action={EditMode}
                />
            </Grid>
        </Paper>
    )
}

const columns2 = [
    { id: 'selectedIngDesc', label: 'Ingredient Description', field: 'selectedIngDesc', width: 300 },
    { id: 'selectedIngSeq', label: 'Seq#', field: 'seqNo', width: 100 },
    { id: 'adj', label: 'Adjustment', field: 'adj', width: 200 },
    { id: 'calButton', label: '', field: 'calButton', width: 200 },
    { id: 'unit', label: 'Unit', field: 'unit', width: 100 },
    { id: 'comments', label: 'Comments', field: 'comments', width: 300 },
]

export default IngredientAdjustment