import { Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AutoComplete, InputField, ActionButtons, } from '../../../../components'
import ProductForm from '../../ProductForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AddRemoveStep, UpdateRemoveStep, fetchAssignBatchToProduct, fetchRemovedSteps, fetchTemplateDetails, initialState } from './Apis';
import { fetchProductBatches } from '../../Transactions/Apis';

const Remove = ({ label }) => {

    const navigate = useNavigate();
    const [searchparams, setSearchParams] = useSearchParams();
    const EditMode = label.startsWith("Edit") || false
    const [config, setconfig] = useState({ loading: false, Found: false })
    const [state, setState] = useState({
        ...initialState,
        sectionCode: searchparams.get('sec') || "",
        prodcode: searchparams.get('prod') || "",
        batchNo: searchparams.get('bat') || "",
        stageCode: searchparams.get('stg') || "",
        mpUnitCode: searchparams.get('uo') || "",
        stepCode: searchparams.get('stp') || "",
        step: { stpLevelNo: searchparams.get('stpLvl') || "" },
        stage: { stgLevelNo: searchparams.get('stglvl') || "" },
        UnitOp: { uoLevelNo: searchparams.get('uolvl') || "" }
    })
    const [productBatches, setproductBatches] = useState([]);
    const { ProductMpr } = useSelector((state) => {
        return {
            ProductMpr: state.Mpr.ProductMpr
        };
    });
    const handleInput = (e, object) => {
        const { name, value } = e.target;
        const updates = { [name]: value || '' };
        if (name === 'prodcode' && value) {
            productSelection(value, object);
        }
        else if (name === 'batchNo' && value) {
            fetchAssignBatchToProduct(state, value, setState)
        }
        if (name === 'stageCode') {
            setState((prev) => ({ ...prev, mpUnitCode: "", stage: object }));
        }
        if (name === 'mpUnitCode') {
            setState((prev) => ({ ...prev, stepCode: "", UnitOp: object }));
        }
        if (name === 'stepCode') {
            setState((prev) => ({ ...prev, step: object }));
        }
        setState((prev) => ({ ...prev, ...updates, }));
    };
    const handleInputs = (e) => {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            RequestBody: { ...prev.RequestBody, [name]: value || '' }
        }));
    };
    const productSelection = (prodcode, product) => {
        const { sectionCode } = product || {};
        setState((prev) => ({ ...prev, sectionCode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
    };
    const handleSave = () => {
        const { batchNo, prodcode, sectionCode, RequestBody,
            stage, UnitOp, step, stageCode, mpUnitCode, stepCode } = state;

        if (!(batchNo && prodcode && sectionCode)) {
            return;
        }
        const Body = {
            ...RequestBody,
            "sectionCode": sectionCode,
            "productCode": prodcode,
            "batchNo": batchNo,
            "stgLvlNo": stage.stgLevelNo,
            "uoLvl": UnitOp.uoLevelNo,
            "stpLvl": step.stpLevelNo,
            "stageCode": stageCode,
            "uoCode": mpUnitCode,
            "stepcode": stepCode,
            "tenantId": "1038",
            "eSignStatus": ""
        }
        if (state.RequestBody.devremovesteppk) {
            UpdateRemoveStep(state.RequestBody)
        }
        else {
            AddRemoveStep(Body)
        }
    };
    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState)
        navigate(-1);
    }
    useEffect(() => {
        if (state.batchDetails) {
            const Body = { ...state, tempCode: state?.batchDetails?.template };
            fetchTemplateDetails(Body, setState);
        }
    }, [state.batchDetails])
    useEffect(() => {
        if (EditMode) {
            fetchAssignBatchToProduct(state, state.batchNo, setState);
            fetchRemovedSteps(state, setState, setconfig)
        }
    }, [])
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <ProductForm
                    stage
                    unitop
                    handleInput={handleInput}
                    productBatches={productBatches}
                    products={ProductMpr || []}
                    state={state}
                    // EditMode={EditMode}
                    setState={setState}
                    config={config}
                />

            </Grid>
            <Grid container spacing={2} mt={5}>
                <Grid item lg={4} md={4} xs={12}>
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
                    <InputField
                        fullWidth
                        label={'Reference No'}
                        sx={{ marginTop: 2 }}
                        onChange={handleInputs}
                        value={state.RequestBody.referenceNo}
                        name="referenceNo"
                    />
                </Grid>
                <Grid item lg={8} md={8} xs={12}>
                    <InputField
                        fullWidth
                        multiline
                        rows={4}
                        label={'Comments'}
                        name='comments'
                        value={state.RequestBody.comments}
                        onChange={handleInputs}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ActionButtons
                        loading={config.loading}
                        onSubmit={handleSave}
                        onClose={handleReset}
                        Found={config.Found}
                        action={EditMode}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Remove;