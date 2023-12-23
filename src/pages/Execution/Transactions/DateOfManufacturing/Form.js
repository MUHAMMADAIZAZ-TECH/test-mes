import { Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { InputField, CustomActionButtons, CustomDatePicker, ActionButtons } from '../../../../components';
import ProductForm from '../../ProductForm';
import { initialState, fetchDateOfManufacturing, UpdateDateOfManufacturing } from './Apis';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProductBatches } from '../Apis';

const DateOfManufacturing = ({ label }) => {
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
    const handleInputProduct = (e, object) => {
        const { name, value } = e.target;
        const updates = { [name]: value || '' };
        if (name === 'prodcode' && value) {
            productSelection(value, object);
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
        setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, [name]: value } }))
    };
    const handleSubmit = () => {
        UpdateDateOfManufacturing(state.RequestBody)
    }
    const handleSearch = () => {
        if (state.batchNo && state.prodcode && state.sectionCode) {
            fetchDateOfManufacturing(state, setState, setconfig)
        }
    };
    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState);
        navigate(-1);
    }
    useEffect(() => {
        if (EditMode) {
            handleSearch()
        }
    }, [])
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
                <Grid item lg={4} md={6} sm={12} xs={12}>
                    <CustomDatePicker width="100%"
                        label="Date of Manufacturing"
                        name='mfgDate'
                        value={state?.RequestBody?.mfgDate}
                        onChange={handleInput}
                        error={false}
                        required
                        size="small"
                        helperText="Please select a date"
                    />
                </Grid>
                <Grid item lg={8} md={6} sm={12} xs={12}>
                    <InputField
                        multiline
                        rows={4}
                        fullWidth
                        label='Comments'
                        name='comments'
                        onChange={handleInput}
                        value={state?.RequestBody?.comments}
                        size='small'
                    />
                </Grid>
            </Grid>
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
    );
}

export default DateOfManufacturing;
