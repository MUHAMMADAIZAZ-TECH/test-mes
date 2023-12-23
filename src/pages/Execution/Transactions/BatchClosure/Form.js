import { Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AutoComplete, InputField, CustomDatePicker, ActionButtons } from '../../../../components'
import ProductForm from '../../ProductForm';
import {
    initialState, fetchBatchStatuses, fetchBatchClosure,
    UpdateBatchClosure, AddBatchClosure, fetchProductDetail
} from './Apis';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchAssignBatchToProduct, fetchProductBatches } from '../Apis';

const BatchClosure = ({ label }) => {
    const navigate = useNavigate();
    const [searchparams, setSearchParams] = useSearchParams();
    const EditMode = label.startsWith("Edit") || false
    const [config, setconfig] = useState({ loading: false, Found: false });
    const [productBatches, setproductBatches] = useState([]);
    const [state, setState] = useState({
        ...initialState,
        sectionCode: searchparams.get('sec') || "",
        prodcode: searchparams.get('prod') || "",
        batchNo: searchparams.get('bat') || "",
    })
    const { ProductMpr } = useSelector((state) => {
        return {
            ProductMpr: state.Mpr.ProductMpr
        };
    });
    const [batchStatuses, setbatchStatuses] = useState([]);
    const handleInputProduct = (e, object) => {
        const { name, value } = e.target;
        const updates = { [name]: value || '' };
        if (name === 'prodcode' && value) {
            productSelection(value, object);
        }
        if (name === 'batchNo' && value) {
            fetchAssignBatchToProduct(state, value, setState)
            setState((prev) => ({ ...prev, ...updates, }));
        }
        setState((prev) => ({ ...prev, ...updates, }));
    };
    const productSelection = (prodcode, product) => {
        const { sectionCode, tempCode } = product || {};
        setState((prev) => ({ ...prev, sectionCode, tempCode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
    };
    const handleInput = (e) => {
        const { name, value } = e.target;
        const Name = name === 'batchStatusCode' ? 'batchStatus' : name;
        setState((prev) => ({
            ...prev,
            RequestBody: { ...prev.RequestBody, [Name]: value }
        }))
    }
    const handleReset = () => {
        // setState(initialState)
        // setconfig({ loading: false, Found: false })
        navigate(-1);
    }
    const handleSearch = () => {
        if (state.sectionCode && state.prodcode && state.batchNo) {
            fetchAssignBatchToProduct(state, state.batchNo, setState)
            fetchBatchClosure(state, setState, setconfig)
        }
    }
    const handleSave = () => {
        if (state?.RequestBody?.batchclosurepk) {
            UpdateBatchClosure(state)
        }
        else {
            AddBatchClosure(state)
        }
    }

    useEffect(() => {
        fetchBatchStatuses(setbatchStatuses)
        if (EditMode) {
            handleSearch()
        }
    }, [])
    useEffect(()=>{
        if(state.batchDetails){
            fetchProductDetail(state, setState)
        }
    },[state.batchDetails])
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <ProductForm
                    handleInput={handleInputProduct}
                    productBatches={productBatches}
                    products={ProductMpr || []}
                    state={state}
                    // EditMode={EditMode}
                    setState={setState}
                    config={config}
                />
            </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid item sm={12} xs={12} md={6} lg={6} container // Add container prop here
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-between'
                >
                    <Grid item pb={2}>
                        <InputField
                            name='acYield'
                            label='Actual Yields'
                            value={state?.RequestBody?.acYield}
                            fullWidth
                            onChange={handleInput}
                            helperText={state?.productDetails?.unit}
                        />
                    </Grid>
                    <Grid item pb={2}>
                        <AutoComplete
                            name='batchStatusCode'
                            width={'100%'}
                            label="Batch Status"
                            getOptionLabel={(option) => `${option.batchStatusCode} | ${option.batchStatusDesc}`}
                            options={batchStatuses || []}
                            onChange={handleInput}
                            value={state?.RequestBody?.batchStatus}
                            placeholder="search..."
                            error={false}
                            required={true}
                        />
                    </Grid>
                    <Grid item pb={2}>
                        <CustomDatePicker
                            width="100%"
                            label="Batch Closure Date"
                            value={state.RequestBody.bthClDate}
                            onChange={handleInput}
                            error={false} // true or false
                            required
                            size="small"
                            name='bthClDate'
                            helperText="Please select a date"
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InputField
                        multiline
                        rows={6}
                        name='comments'
                        value={state.RequestBody.comments}
                        label={'Comments'}
                        fullWidth
                        onChange={handleInput}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ActionButtons
                    loading={config.loading}
                    onClose={handleReset}
                    onSubmit={handleSave}
                    Found={config.Found}
                    action={EditMode}
                />
            </Grid>
        </Paper>
    )
}

export default BatchClosure;