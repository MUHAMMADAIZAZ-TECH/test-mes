import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ActionButtons, DescriptionHeader } from '../../../../components'
import ProductForm from '../../ProductForm';
import {
    initialState, fetchAssignAreas, fetchAreasList,
    UpdateAssignAreas, AddAssignAreas, fetchAssignBatchToProduct,
    fetchTemplateDetails
} from './Apis'
import MultileRowTable from './AreaTable';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { fetchProductBatches } from '../Apis'

const AssignArea = ({ label }) => {

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
        stage: { stgLevelNo: searchparams.get('stglvl') || "" },
        UnitOp: { uoLevelNo: searchparams.get('uolvl') || "" }
    })
    const [selectedRows, setSelectedRows] = useState([]);
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
            fetchAreasList({ ...state, tempCode: state?.Template?.tempCode, mpUnitCode: value }, setState, setconfig)
            if (EditMode) {
                fetchAssignAreas({ ...state, mpUnitCode: value }, setState, setconfig, setSelectedRows)
            }
        }

        setState((prev) => ({ ...prev, ...updates, }));
    };
    const productSelection = (prodcode, product) => {
        const { sectionCode } = product || {};
        setState((prev) => ({ ...prev, sectionCode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
    };
    const handleSearch = () => {
        if (state.batchNo && state.prodcode && state.sectionCode && state.stageCode && state.mpUnitCode) {
            fetchAssignAreas(state, setState, setconfig, setSelectedRows)
        }
    }
    const handleSave = () => {
        const { batchNo, prodcode, sectionCode, stage, RequestBody } = state;

        if (!(batchNo && prodcode && sectionCode && stage && selectedRows.length > 0)) {
            return;
        }

        const areas = selectedRows.map(({ areaTypeCode, areaCode, comments }) => ({
            areaTypeCode,
            areaCode,
            cltr: "CLTR",
            perBy: "USER",
            perDate: "00:00.0",
            comments: comments || '',
        }));
        const apiFunction = RequestBody.assignareapk ? UpdateAssignAreas : AddAssignAreas;
        apiFunction(state, [...areas]);
    };

    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState)
        navigate(-1);
    }
    useEffect(() => {
        if (EditMode) {
            handleSearch()
        }
        fetchAssignBatchToProduct(state, state.batchNo, setState)
    }, [])
    useEffect(() => {
        if (state.batchDetails) {
            const Body = { ...state, tempCode: state?.batchDetails?.template };
            fetchTemplateDetails(Body, setState,
                EditMode ? () => fetchAreasList(Body, setState, setconfig) : null
            );
        }
    }, [state.batchDetails])
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
                    EditMode={EditMode}
                    setState={setState}
                    config={config}
                />
            </Grid>
            <Grid container spacing={2} mt={5}>
                <Grid item xs={12}>
                    {state?.Template && state?.batchDetails?.thYield && (
                        <DescriptionHeader sx={{ backgroundColor: "#4b9dea" }}>
                            <Box display='flex' justifyContent='space-between' color='white'>
                                <Typography>
                                    Template: {`${state?.Template?.tempCode} - ${state?.Template?.tempDesc}`}
                                </Typography>
                                <Typography>
                                    Batch Size: {state?.batchDetails?.thYield || ''}
                                </Typography>
                            </Box>
                        </DescriptionHeader>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <MultileRowTable
                        data={state.areaList || []}
                        tableHeader={columns}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        assignedList={state.RequestBody.detail || []}
                    />
                </Grid>
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
        </Paper>
    )
}

const columns = [
    { id: 'areaCode', label: 'Area', field: 'areaCode', width: 200 },
    { id: 'areaTypeCode', label: 'Area Type', field: 'areaTypeCode', width: 400 },
    { id: 'comments', label: 'Comments', field: 'Comments', width: 400 }
]

export default AssignArea