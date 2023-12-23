import { Box, FormControl, FormGroup, FormLabel, Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
    InputField, CustomCheckbox, FileUploadButton, CustomActionButtons,
    CustomTable, CustomButton, AutoComplete, ActionButtons
} from '../../../../components'
import ProductForm from '../../ProductForm';
import {
    AddDocumentUpload, initialState, InitialDoc, Options,
    fetchDocuments, UpdateDocumentData, AddDocumentData,
    downloadFile
} from './Apis';
import { fetchAssignBatchToProduct, fetchProductBatches, fetchTemplateDetails } from '../Apis';
import { Done } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const DocumentUpload = ({ label }) => {
    const navigate = useNavigate();
    const [searchparams, setSearchParams] = useSearchParams();
    const EditMode = label.startsWith("Edit") || false
    const [documentOptions, setDocumentOptions] = useState(Options);
    const [docObject, setdocObject] = useState(InitialDoc)
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
    const [file, setfile] = useState(null);
    const handleInput = (e, object) => {
        const { name, value } = e.target;
        if (name === 'prodcode' && value) {
            productSelection(value, object);
        }
        if (name === 'batchNo' && value) {
            setState((prev) => ({ ...prev, [name]: value, stageCode: "", mpUnitCode: "", stepCode: "" }));
        }
        if (name === 'stageCode') {
            setState((prev) => ({ ...prev, [name]: value, mpUnitCode: "", stage: object }));
        }
        if (name === 'mpUnitCode') {
            setState((prev) => ({ ...prev, [name]: value, stepCode: "", UnitOp: object }));
        }
        if (name === 'stepCode') {
            setState((prev) => ({ ...prev, [name]: value, Step: object }));
        }
        setdocObject((prev) => ({ ...prev, [name]: value || '' }))
    }
    const productSelection = (prodcode, product) => {
        const { sectionCode, tempCode } = product || {};
        setState((prev) => ({ ...prev, sectionCode, tempCode, prodcode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
        fetchTemplateDetails({ sectionCode, tempCode, prodcode }, setState)
    };

    const handleSubmit = () => {
        const RequestBody = {
            ...state.RequestBody,
            sectionCode: state.sectionCode,
            productCode: state.prodcode,
            batchNo: state.batchNo,
        }
        state?.RequestBody?.docuploadunitoppk ?
            UpdateDocumentData(RequestBody) :
            AddDocumentData(RequestBody)
    }
    const handleUpload = () => {
        AddDocumentUpload({
            documentOptions,
            docObject,
            state
        }, setState, file)
    }
    const handleFile = (file) => setfile(file)
    const handleCheckboxChange = (name) => {
        setDocumentOptions((prevOptions) => ({
            ...prevOptions,
            [name]: !prevOptions[name],
        }));
    };
    const downloadDoc = (row) => {
        downloadFile(row);
    };
    const handleSearch = () => {
        if (state.batchNo && state.prodcode && state.sectionCode) {
            const productMpr = ProductMpr.length > 0 && ProductMpr.find((mpr) => (mpr.prodcode === state.prodcode))
            fetchTemplateDetails({ ...state, tempCode: productMpr?.tempCode || "" }, setState)
            fetchDocuments(state, setState, setconfig)
        }
    };
    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState);
        // setdocObject(InitialDoc);
        // setfile(null);
        // setDocumentOptions(Options);
        navigate(-1);
    }
    const removeDocument = (_, index) => {
        const UpdatedDocs = [...state.RequestBody.docs]
        UpdatedDocs.splice(index, 1)
        setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, docs: UpdatedDocs } }))
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
                <Grid item sm={6} xs={12} lg={3} md={3} >
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Document Related To</FormLabel>
                        <FormGroup>
                            <CustomCheckbox
                                label="Batch"
                                checked={documentOptions.batch}
                                onChange={() => handleCheckboxChange('batch')}
                            />
                            <CustomCheckbox
                                disabled={documentOptions.batch}
                                label="Stage"
                                checked={documentOptions.stage}
                                onChange={() => handleCheckboxChange('stage')}
                            />
                            <CustomCheckbox
                                disabled={documentOptions.batch || state.stageCode === ''}
                                label="Unit Operation"
                                checked={documentOptions.unitOperation}
                                onChange={() => handleCheckboxChange('unitOperation')} />
                            <CustomCheckbox
                                disabled={documentOptions.batch || state.mpUnitCode === ''}
                                label="Step"
                                checked={documentOptions.step}
                                onChange={() => handleCheckboxChange('step')} />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid item sm={6} xs={12} lg={3} md={3}>
                    <AutoComplete
                        disabled={!documentOptions.stage || documentOptions.batch}
                        label="Stage"
                        name='stageCode'
                        sx={{ mb: 2 }}
                        width={'100%'}
                        options={state?.Template?.stage || []}
                        getOptionLabel={(option) => `${option.stageCode} | ${option.stageDesc}`}
                        value={state.stageCode}
                        onChange={handleInput}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                    <AutoComplete
                        disabled={!documentOptions.unitOperation || documentOptions.batch}
                        value={state.mpUnitCode}
                        label="Unit Operation"
                        name='mpUnitCode'
                        width={'100%'}
                        sx={{ mb: 2 }}
                        options={state?.Template?.unitOperation?.filter((op) => op.stgLevelNo === state?.stage?.stgLevelNo) || []}
                        getOptionLabel={(option) => `${option.mpUnitCode} | ${option.mpUnitDesc}`}
                        onChange={handleInput}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                    <AutoComplete
                        disabled={!documentOptions.step || documentOptions.batch}
                        value={state.stepCode}
                        label="Steps"
                        name='stepCode'
                        width={'100%'}
                        sx={{ mb: 2 }}
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
                        required sx={{ width: '100%', mb: 2 }}
                        fullWidth
                        name='referenceNo'
                        label="Reference No"
                        value={docObject.referenceNo}
                        onChange={handleInput}
                        error={false}
                    />
                    <Box
                        display='flex'
                        justifyContent={{ xs: 'flex-start', lg: 'space-between' }}
                        flexDirection={{ xs: 'column', lg: 'row' }}
                        width='100%'>
                        <FileUploadButton
                            additionalStyles={{ width: '100%', height: 35 }}
                            size="small"
                            text="Browse"
                            backgroundColor="#3498DB"
                            onChange={handleFile}
                        />
                        <CustomButton
                            sx={{ width: '100%', height: 35, ml: { xs: 0, lg: 2 }, mt: { lg: 0, xs: 2 } }}
                            startIcon={<Done />}
                            backgroundColor="#28B463"
                            variant={"contained"}
                            onClick={handleUpload}
                        >
                            Upload
                        </CustomButton>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} lg={6} md={6}>
                    <Box display="flex" flexDirection="column">
                        <InputField
                            multiline
                            rows={5}
                            value={docObject.comments}
                            label='Comments'
                            name='comments'
                            onChange={handleInput}
                        />
                        <InputField
                            multiline
                            rows={5}
                            value={docObject.docDesc}
                            label='Document Description'
                            name='docDesc'
                            sx={{ marginTop: 2 }}
                            onChange={handleInput}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <CustomTable
                        data={state.RequestBody.docs || []}
                        tableHeader={tableHeaderDocument}
                        showCheckBox={false}
                        showDeleteButton={true}
                        onDelete={removeDocument}
                        showDownloadButton={true}
                        onDownload={downloadDoc}
                        containerStyles={{ maxHeight: "150px", overflowY: "auto" }}
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
    )
}

const tableHeaderDocument = [
    { id: "docTitle", label: "Document Title", field: "docTitle" },
    { id: "stgCode", label: "Stage Code", field: "stgCode" },
    { id: "uoCode", label: "Unit Operation Code", field: "stpCode" },
    { id: "stpCode", label: "Step Code", field: "stpCode" },
    { id: "docRelTo", label: "Related To", field: "docRelTo" },
    { id: "docDesc", label: "Document Description", field: "docDesc" },
    { id: "docExt", label: "Document Extention", field: "docExt" },
    { id: "comments", label: "comments", field: "comments" },
];
export default DocumentUpload;
