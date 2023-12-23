import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
    CustomButton, CustomModal, CustomTable, InputField, ActionButtons
} from '../../../../components'
import ProductForm from '../../ProductForm';
import CollapsibleTable from './LotTable';
import { fetchAssignMaterial, initialState, InitialLot, UpdateAssignMaterial, AddAssignMaterial } from './Apis';
import { Add } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProductBatches, fetchTemplateDetails, fetchTheoriticalQTY } from '../Apis';

const AssignMaterial = ({ label }) => {
    const navigate = useNavigate();
    const EditMode = label.startsWith("Edit") || false
    const [openModal, setopenModal] = useState(false);
    const [config, setconfig] = useState({ loading: false, Found: false })
    const [searchparams, setSearchParams] = useSearchParams();
    const [productBatches, setproductBatches] = useState([]);
    const [state, setState] = useState({
        ...initialState,
        sectionCode: searchparams.get('sec') || "",
        prodcode: searchparams.get('prod') || "",
        batchNo: searchparams.get('bat') || "",
        stageCode: searchparams.get('stg') || "",
        tempCode: searchparams.get('tem') || "",
    })
    const { ProductMpr } = useSelector((state) => {
        return {
            ProductMpr: state.Mpr.ProductMpr
        };
    });
    const [selectedRow, setselectedRow] = useState(null);
    const [LotArray, setLotArray] = useState([]);
    const [Lot, setLot] = useState(InitialLot);
    const handleOpenModal = (row, rowIndex) => {
        setselectedRow({ ...row, rowIndex })
        setLotArray(row.lot || [])
        setLot(InitialLot)
        setopenModal(true);
    }
    const handleCloseModal = () => {
        setopenModal(false);
    }
    const handleInputProduct = (e, object) => {
        const { name, value } = e.target;
        const updates = { [name]: value || '' };
        if (name === 'prodcode' && value) {
            productSelection(value, object);
        }
        if (name === 'stageCode') {
            stageSelection(value, object);
        }
        setState((prev) => ({ ...prev, ...updates, }));
    };
    const productSelection = (prodcode, product) => {
        const { sectionCode, tempCode } = product || {};
        setState((prev) => ({ ...prev, sectionCode, tempCode }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
        fetchTemplateDetails(product, setState);
    };
    const stageSelection = async (value) => {
        const TheoriticalQuantity = await fetchTheoriticalQTY(state)
        const StageQtyClass = TheoriticalQuantity.find((item) => (item.stageCode === value));
        const StageQty = StageQtyClass?.lstThQtyClasses?.map((item) => ({
            "ingCode": item.ingProductCode,
            "ingDesc": item.ingProductDesc,
            "ww": item.wwValue,
            "qtyKg": item.qtyPerStdKg,
            "qtyG": item.qtyPerStdG,
            "qtyMg": item.qtyPerStdMg,
            "seqNo": item.seqNo,
            "expDate": "<string>",
            "reDate": "<string>",
            "qtyUnitMg": "<string>",
            "thQtyKg": item.thQtyKg,
            "thQtyG": item.thQtyG,
            "thQtyMg": item.thQtyMg,
            "lotBreakable": item.lotBreakable,
        }))
        setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, ing: StageQty },StageQty:StageQtyClass }))
    }
    const onInputChange = (value) => {
        setState((prev) => ({ ...prev, batchNo: value }));
    }
    const handleSave = () => {
        if (state.RequestBody.assignmaterialpk) {
            UpdateAssignMaterial(state.RequestBody)
        }
        else {
            const Body = {
                ...state.RequestBody,
                "sectionCode": state.sectionCode,
                "productCode": state.prodcode,
                "batchNo": state.batchNo,
                "stageCode": state.stageCode,
                "stdQty": state.StageQty.stdQty,
                "eSignStatus": "<string>",
                "tenantId": "1038"
            }
            AddAssignMaterial(Body)
        }
    }
    const onAddLot = () => {
        const newArray = [...LotArray];
        if (!Lot || !selectedRow) {
            console.log("Lot or selectedRow is undefined.");
            return;
        }
        const Error = {
            thQtyKg: parseInt(Lot.thQtyKg) <= parseInt(selectedRow.thQtyKg),
            thQtyG: parseInt(Lot.thQtyG) <= parseInt(selectedRow.thQtyG),
            thQtyMg: parseInt(Lot.thQtyMg) <= parseInt(selectedRow.thQtyMg)
        };
        if (Object.values(Error).every((error) => error)) {
            const totalThQtyKg = newArray.reduce((sum, lot) => sum + parseInt(lot.thQtyKg), 0);
            const totalThQtyG = newArray.reduce((sum, lot) => sum + parseInt(lot.thQtyG), 0);
            const totalThQtyMg = newArray.reduce((sum, lot) => sum + parseInt(lot.thQtyMg), 0);
            if (
                totalThQtyKg + parseInt(Lot.thQtyKg) <= parseInt(selectedRow.thQtyKg) &&
                totalThQtyG + parseInt(Lot.thQtyG) <= parseInt(selectedRow.thQtyG) &&
                totalThQtyMg + parseInt(Lot.thQtyMg) <= parseInt(selectedRow.thQtyMg)
            ) {
                newArray.push(Lot);
                setLotArray(newArray);
                setLot(InitialLot)
                setselectedRow((prev) => ({ ...prev, lot: newArray }))
            } else {
                console.log("Adding the lot would exceed one or more quantity limits.");
            }
        } else {
            console.log("One or more quantity conditions are not met.");
        }
    };
    const onRemoveLot = (value, index) => {
        console.log(value, index);
    }
    const handleAddLot = () => {
        const totalThQtyKg = selectedRow.lot.reduce((sum, lot) => sum + parseInt(lot.thQtyKg), 0);
        const totalThQtyG = selectedRow.lot.reduce((sum, lot) => sum + parseInt(lot.thQtyG), 0);
        const totalThQtyMg = selectedRow.lot.reduce((sum, lot) => sum + parseInt(lot.thQtyMg), 0);
        if (
            totalThQtyKg !== parseInt(selectedRow.thQtyKg) ||
            totalThQtyG !== parseInt(selectedRow.thQtyG) ||
            totalThQtyMg !== parseInt(selectedRow.thQtyMg)
        ) {
            console.log("Requirement Not meet")
        }
        else {
            const ing = [...state.RequestBody.ing]
            const selectedItem = { ...selectedRow, lot: selectedRow.lot.map((lot, index) => ({ ...lot, subSeq: `${index + 1}` })) };
            ing[selectedRow.rowIndex] = selectedItem
            setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, ing } }))
            handleCloseModal(false)
        }

    }

    const handleDeleteLot = (_, index) => {
        const Array = [...LotArray]
        Array.splice(index, 1)
        setselectedRow((prev) => ({ ...prev, lot: Array }))
        setLotArray(Array)
    }
    const handleSearch = () => {
        if (state.batchNo && state.prodcode && state.sectionCode && state.stageCode) {
            fetchAssignMaterial(state, setState, setconfig)
        }
    }
    const handleInput = (e) => {
        setLot((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState)
        navigate(-1);
    }
    // const handleReorder = (LotArray) => {
    //     const updatedLotArray = LotArray.map((item, index) => ({ ...item, subSeq: `${index + 1}` }));
    //     setState((prev) => ({
    //         ...prev,
    //         RequestBody: {
    //             ...prev.RequestBody,
    //             ing: prev.RequestBody.ing.map((ing, i) =>
    //                 i === selectedRow.rowIndex ? { ...ing, lot: updatedLotArray } : ing
    //             ),
    //         },
    //     }));
    // };
    useEffect(() => {
        if (EditMode) {
            handleSearch()
            fetchProductBatches('InitiateBatch', setproductBatches, state.prodcode);
            fetchTemplateDetails(state, setState);
        }
    }, [])
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <ProductForm
                    handleInput={handleInputProduct}
                    productBatches={productBatches}
                    onInputChange={onInputChange}
                    products={ProductMpr || []}
                    state={state}
                    stage
                    // EditMode={EditMode}
                    setState={setState}
                    config={config}
                    freeSolo
                />
            </Grid>
            <Box mt={5}>
                <CollapsibleTable
                    data={state?.RequestBody?.ing || []}
                    onAddLot={handleOpenModal}
                    onRemoveLot={onRemoveLot}
                    // handleReorder={handleReorder}
                    state={state}
                    setState={setState}
                />
            </Box>
            <Grid item xs={12}>
                <ActionButtons
                    loading={config.loading}
                    onSubmit={handleSave}
                    onClose={handleReset}
                    Found={config.Found}
                    action={EditMode}
                />
            </Grid>
            <CustomModal
                open={openModal}
                onClose={handleCloseModal}
                width='80%'
                maxHeight='100%'
                content={<Box sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <Typography variant='h6' pb={2}>Requirement Theoritical Quantity</Typography>
                            <CustomTable
                                data={[{
                                    code: selectedRow?.ingCode,
                                    desc: selectedRow?.ingDesc,
                                    kg: selectedRow?.thQtyKg,
                                    g: selectedRow?.thQtyG,
                                    mg: selectedRow?.thQtyMg,
                                }]}
                                tableHeader={SelectedCol}
                                showCheckBox={false}
                                paper
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={3}>
                        <Grid item xs={3}>
                            <InputField
                                fullWidth
                                label='Lot No'
                                name='lotNo'
                                value={Lot.lotNo}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                fullWidth
                                label='Th.Qty (kg)'
                                name='thQtyKg'
                                value={Lot.thQtyKg}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                fullWidth
                                label='Th.Qty (g)'
                                name='thQtyG'
                                value={Lot.thQtyG}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                fullWidth
                                label='Th.Qty (mg)'
                                name='thQtyMg'
                                value={Lot.thQtyMg}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <InputField
                                fullWidth
                                label='Comments'
                                name='comments'
                                value={Lot.comments}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={2} textAlign='right'>
                            <CustomButton
                                onClick={onAddLot}
                                startIcon={<Add />}
                                variant="contained"
                                sx={{ p: 1 }}
                            >
                                Add New Lot
                            </CustomButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12}>
                            <CustomTable
                                data={LotArray || []}
                                tableHeader={column2}
                                showCheckBox={false}
                                onDelete={handleDeleteLot}
                                showDeleteButton
                                maxHeight={300}
                                stickyheader
                            />
                            <Box mt={3} display='flex' justifyContent='flex-end'>
                                <CustomButton onClick={handleAddLot}>Ok</CustomButton>
                                <CustomButton onClick={handleCloseModal}>Cancel</CustomButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>}
            >
            </CustomModal>
        </Paper>
    )
}

const column2 = [
    { id: 'lotNo', label: 'Lot No', field: 'lotNo', },
    // { id: 'subSeq', label: 'Sub Seq.#', field: 'subSeq', },
    { id: 'thQtyKg', label: 'Th. Qty (kg)', field: 'thQtyKg', },
    { id: 'thQtyG', label: 'Th. Qty (g)', field: 'thQtyG', },
    { id: 'thQtyMg', label: 'Th. Qty (mg)', field: 'thQtyMg', },
    { id: 'comments', label: 'Comments', field: 'comments' },
]
const SelectedCol = [
    { id: 'code', label: 'Code', field: 'code', },
    { id: 'desc', label: 'Description', field: 'desc' },
    { id: 'kg', label: 'Required Th. Qty (kg)', field: 'kg', },
    { id: 'g', label: 'Required Th. Qty (g)', field: 'g', },
    { id: 'mg', label: 'Required Th. Qty (mg)', field: 'mg', },
]

export default AssignMaterial;