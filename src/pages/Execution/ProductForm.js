// ProductForm.js
import React from 'react';
import Grid from '@mui/material/Grid';
import { AutoComplete, InputField } from '../../components';

const ProductForm = ({
    handleInput,
    productBatches,
    products,
    state,
    onInputChange,
    config,
    EditMode,
    stage,
    unitop,
    step,
    option,
    freeSolo,
}) => {
    return (
        <>
            <Grid item xs={12} md={6} lg={4}>
                <AutoComplete
                    width={'100%'}
                    label="Product"
                    options={products || []}
                    getOptionLabel={(option) => `${option.prodcode} | ${option.prodDesc}`}
                    value={state.prodcode}
                    onChange={handleInput}
                    disabled={config.Found || EditMode}
                    placeholder="search..."
                    name='prodcode'
                    error={false}
                    required={true}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <InputField
                    label='Section'
                    value={state.prodcode !== '' ? state?.sectionCode : ''}
                    required
                    fullWidth
                    disabled
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <AutoComplete
                    width={'100%'}
                    label="Batch No"
                    name='batchNo'
                    inputValue={state.batchNo}
                    options={productBatches || []}
                    getOptionLabel={(option) => `${option.batchNo}`}
                    value={state.batchNo}
                    onChange={handleInput}
                    onInputChange={onInputChange}
                    disabled={state.prodcode === '' || EditMode || config.Found }
                    placeholder="search..."
                    error={false}
                    required={true}
                    freeSolo={freeSolo}
                />
            </Grid>
            {stage && <Grid item xs={12} md={6} lg={4}>
                <AutoComplete
                    disabled={state.prodcode === '' || config.Found }
                    label="Stage"
                    name='stageCode'
                    width={'100%'}
                    options={state?.Template?.stage || []}
                    getOptionLabel={(option) => `${option.stageCode} | ${option.stageDesc}`}
                    value={state.stageCode}
                    onChange={handleInput}
                    placeholder="search..."
                    error={false}
                    required={true}
                />
            </Grid>}
            {unitop && <Grid item xs={12} md={6} lg={4}>
                <AutoComplete
                    disabled={state.prodcode === '' || config.Found}
                    value={state.mpUnitCode}
                    label="Unit Operation"
                    name='mpUnitCode'
                    width={'100%'}
                    options={state?.Template?.unitOperation?.filter((op) => op.stgLevelNo === state?.stage?.stgLevelNo) || []}
                    getOptionLabel={(option) => `${option.mpUnitCode} | ${option.mpUnitDesc}`}
                    onChange={handleInput}
                    placeholder="search..."
                    error={false}
                    required={true}
                />
            </Grid>}
            {step && <Grid item xs={12} md={6} lg={4}>
                <AutoComplete
                    disabled={state.prodcode === '' || config.Found}
                    value={state.stepCode}
                    label="Steps"
                    name='stepCode'
                    width={'100%'}
                    options={state?.Template?.step?.filter((op) =>
                        op.stgLevelNo === state?.stage?.stgLevelNo &&
                        op.uoLevelNo === state?.UnitOp?.uoLevelNo) || []}
                    getOptionLabel={(option) => `${option.stepCode} | ${option.stepDesc}`}
                    onChange={handleInput}
                    placeholder="search..."
                    error={false}
                    required={true}
                />
            </Grid>}
            {option &&
                <Grid item xs={12} md={12} lg={8}>
                    <AutoComplete
                        disabled={state.prodcode === '' || config.Found}
                        width={'100%'}
                        value={state.adjOptCode}
                        label='Options'
                        name='adjOptCode'
                        options={state?.IngAdjustOptions?.ingAdj_list.filter((op) => op.stageCode === state.stageCode) || []}
                        getOptionLabel={(option) => `${option.adjOptCode} | ${option.adjOptDesc}`}
                        onChange={handleInput}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>}
        </>
    );
};

export default ProductForm;
