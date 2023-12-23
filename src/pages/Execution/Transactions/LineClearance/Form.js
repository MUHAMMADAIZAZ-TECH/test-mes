import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Accordion, ActionButtons, CustomButton, CustomTable, DescriptionHeader } from '../../../../components'
import { Add, Verified } from '@mui/icons-material';
import ProductForm from '../../ProductForm';
import CollapsibleTable from './LcTable';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProductBatches } from '../Apis'
import {
    fetchAssignBatchToProduct, fetchAssignAreas, fetchAreasTypesMpr,
    ValidatedLC, columns, columns2, columns3, TestHeader,
    AddLineClearance, UpdateLineClearance, ValidatedLConAdd,
    fetchLineClearance, fetchTemplateDetails, initialState
} from './Apis';

const LineClearance = ({ label }) => {
    const navigate = useNavigate();
    const [searchparams, setSearchParams] = useSearchParams();
    const EditMode = label.startsWith("Edit") || false
    const [config, setconfig] = useState({ loading: false, Found: false });
    const [Tests, setTests] = useState([])
    const [isValid, setisValid] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [state, setState] = useState({
        ...initialState,
        sectionCode: searchparams.get('sec') || "",
        prodcode: searchparams.get('prod') || "",
        batchNo: searchparams.get('bat') || "",
        tempCode: searchparams.get('tem') || "",
        stageCode: searchparams.get('stg') || "",
        mpUnitCode: searchparams.get('uo') || "",
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
            setState((prev) => ({ ...prev, stageCode: "", mpUnitCode: "", areaList: [] }));
            fetchAssignBatchToProduct(state, value, setState)
        }
        if (name === 'stageCode') {
            setState((prev) => ({ ...prev, mpUnitCode: "", stage: object }));
        }
        if (name === 'mpUnitCode') {
            setState((prev) => ({ ...prev, stepCode: "", UnitOp: object }));
            fetchAreasTypesMpr({ ...state, mpUnitCode: value }, setState)
            fetchAssignAreas({ ...state, mpUnitCode: value }, setState, setconfig)
            if (EditMode) {
                fetchLineClearance({ state: { ...state, mpUnitCode: value }, setState })
            }
        }

        setState((prev) => ({ ...prev, ...updates, }));
    };
    const onRowSelect = (row) => {
        if (state.lineClr.length > 0 && state.areaTypes.length > 0 && row) {
            const Tests = state.lineClr.filter((item) => item.lccode === state?.areaTypes?.find((item) =>
                item.mpUnitOpCode === state.mpUnitCode)?.basicAreaTypeClasses.find((area) =>
                    area.areaTypeCode === row.areaTypeCode)?.lcCode) || [];
            setTests(Tests)
            setState((prev) => ({ ...prev, lcCode: Tests[0].lccode || "" }));
            setisValid(false)
        }
    }
    const productSelection = (prodcode, product) => {
        setState((prev) => ({ ...prev, sectionCode: product.sectionCode || "", tempCode: product.tempCode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
        fetchTemplateDetails({ ...state, sectionCode: product.sectionCode || "", tempCode: product.tempCode, prodcode }, setState)
    };
    const onValidate = () => {
        ValidatedLC(
            { state, selectedRows },
            { setSelectedRows, setisValid })
    }
    const onAddValidate = () => {
        if (selectedRows.length > 0) {
            ValidatedLConAdd({ state, selectedRows }, setState, EditMode)
        }
    }
    const handleSave = () => {
        if (state.RequestBody.unitoperationlcpk) {
            UpdateLineClearance({ ...state.RequestBody, eSignStatus: "String" })
        }
        else {
            const Body = {
                ...state.RequestBody,
                "sectionCode": state.sectionCode,
                "productCode": state.prodcode,
                "batchNo": state.batchNo,
                "tempCode": state.tempCode,
                "stageCode": state.stageCode,
                "unitCode": state.mpUnitCode,
                "eSignStatus": "string",
                "stgLvl": state.stage.stgLevelNo,
                "unitLvl": state.UnitOp.uoLevelNo,
                "tenantId": "1038"
            }
            AddLineClearance(Body)
        }
    }
    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState)
        navigate(-1);
    }
    useEffect(() => {
        if (EditMode) {
            fetchAssignAreas(state, setState)
            fetchTemplateDetails(state, setState)
            fetchAreasTypesMpr(state, setState)
            fetchLineClearance({ state, setState })
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
                    EditMode={EditMode}
                    setState={setState}
                    config={config}
                />
            </Grid>
            <Grid container spacing={2} mt={5}>
                <Grid item xs={12}>
                    <DescriptionHeader sx={{ backgroundColor: "#4b9dea" }}>
                        <Box display='flex' justifyContent='space-between' color='white'>
                            <Typography>
                                Comments: This is Dummy Comments
                            </Typography>
                        </Box>
                    </DescriptionHeader>
                </Grid>
                <Grid item xs={2}>
                    <CustomTable
                        data={state.areaList || []}
                        tableHeader={columns || []}
                        onRowSelect={onRowSelect}
                    />
                </Grid>
                <Grid item xs={10}>
                    <CollapsibleTable
                        defaultOpen={true}
                        showCheckBox={false}
                        rows={Tests || []}
                        tableHeader={columns2 || []}
                        onRowSelect={onRowSelect}
                        TestHeader={TestHeader}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='flex-end'>
                        {isValid ? <CustomButton
                            backgroundColor="#28B463"
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onAddValidate}
                        >
                            Add Line Clearance
                        </CustomButton> : <CustomButton
                            variant="contained"
                            startIcon={<Verified />}
                            onClick={onValidate}
                        >
                            Validate
                        </CustomButton>}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Accordion
                        sx={{ backgroundColor: '#4b9dea', color: 'white' }}
                        htmlColor='white'
                        title='Electronically Signed (Line Clearance)'
                        childComponent={
                            <CollapsibleTable
                                defaultOpen={false}
                                showCheckBox={false}
                                rows={state.RequestBody.unitLCClasses || []}
                                tableHeader={columns3 || []}
                                onRowSelect={onRowSelect}
                                TestHeader={TestHeader}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                            />
                        }
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



export default LineClearance;