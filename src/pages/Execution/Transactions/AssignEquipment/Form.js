import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
    AutoComplete, InputField, CustomDatePicker,
    CustomButton, DescriptionHeader, CustomActionButtons, CustomTable, Accordion, CustomModal, ActionButtons
} from '../../../../components'
import { Add } from '@mui/icons-material';
import ProductForm from '../../ProductForm';
import { DateTime } from 'luxon';
import {
    fetchAssignEquipment, fetchEquipmentTypes, initialState,
    initialEquipment, AddAssignEquipment, UpdateAssignEquipment,
    fetchEquipments, fetchEquipment, fetchStep,
} from './Apis';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchAssignBatchToProduct, fetchProductBatches, fetchTemplateDetails } from '../Apis';

const AssignEquipment = ({ label }) => {
    const navigate = useNavigate();
    const [searchparams, setSearchParams] = useSearchParams();
    const EditMode = label.startsWith("Edit") || false
    const [config, setconfig] = useState({ loading: false, Found: false })
    const [state, setState] = useState({
        ...initialState,
        sectionCode: searchparams.get('sec') || "",
        prodcode: searchparams.get('prod') || "",
        batchNo: searchparams.get('bat') || "",
        tempCode: searchparams.get('tem') || "",
    })
    const [productBatches, setproductBatches] = useState([]);
    const { ProductMpr, Equipments } = useSelector((state) => {
        return {
            ProductMpr: state.Mpr.ProductMpr,
            Equipments: state.Mpr.Equipments
        };
    });
    const [Equipment, setEquipment] = useState(initialEquipment);
    const [openModal, setOpenModal] = useState(false);
    const handleInput = (e, object) => {
        const { name, value } = e.target;
        const updates = { [name]: value || '' };
        if (name === 'prodcode' && value) {
            productSelection(value, object);
        }
        else if (name === 'batchNo' && value) {
            fetchAssignBatchToProduct(state, value, setState)
            fetchEquipmentTypes({ ...state, batchNo: value }, setState)
        }
        if (name === "eqpTypeCode") {
            setState((prev) => ({ ...prev, [name]: value, selectedEquipType: object }));
            fetchEquipment(value, setState)
        }
        if (name === "insCode") {
            setState((prev) => ({ ...prev, [name]: value, selectedEquipment: object }));
        }
        setState((prev) => ({ ...prev, ...updates, }));
    };
    const productSelection = (prodcode, product) => {
        const { sectionCode, tempCode } = product || {};
        setState((prev) => ({
            ...prev,
            products: ProductMpr,
            product: product || null,
            sectionCode,
            tempCode
        }));
        fetchProductBatches('InitiateBatch', setproductBatches, prodcode);
        fetchTemplateDetails(product, setState);
    };
    const handleOpenModal = (row) => {
        fetchStep(row.stepCode, setState, () => {
            setOpenModal(true);
        })
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleSearch = () => {
        if (state.batchNo && state.prodcode && state.sectionCode) {
            fetchAssignEquipment(state, setState, setconfig)
            fetchEquipmentTypes(state, setState)
        }
    }
    const handleSave = () => {
        if (state?.RequestBody?.assignequipmentpk) {
            UpdateAssignEquipment(state)
        }
        else {
            AddAssignEquipment(state)
        }
    };
    const handleReset = () => {
        // setconfig((prev) => ({ ...prev, Found: false }))
        // setState(initialState)
        // setEquipment(initialEquipment)
        navigate(-1);
    }
    const handleAddEquipment = () => {
        setState(prev => ({
            ...prev,
            RequestBody: {
                ...prev.RequestBody,
                detail: [...prev.RequestBody.detail, {
                    ...Equipment,
                    equipmentTypeCode: state.eqpTypeCode,
                    equipmentCode: state.insCode,
                    cltr: Equipment.cltr || '-'
                }],
            },
        }));
    };
    const handleRemoveEquipment = (row, indexToRemove) => {
        setState((prev) => {
            const updatedDetail = prev.RequestBody.detail.filter((_, index) => index !== indexToRemove);
            return {
                ...prev,
                RequestBody: {
                    ...prev.RequestBody,
                    detail: updatedDetail,
                },
            };
        });
    };
    const handleEquipment = (e) => {
        setEquipment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const EquipmentTypes = state.equipmentTypeList.flatMap(
        (step) => step.basicEquipmentTypes
    ).reduce((acc, equipmentType) => {
        const existingType = acc.find(
            (existing) => existing.eqpTypeCode === equipmentType.eqpTypeCode
        );

        if (existingType) {
            existingType.minimumNo += parseInt(equipmentType.minimumNo, 10);
        } else {
            acc.push({ ...equipmentType });
        }

        return acc;
    }, []);
    const AssociatedSteps = state?.equipmentTypeList?.filter((step) =>
        step.basicEquipmentTypes.some(
            (equipmentType) => equipmentType?.eqpTypeCode === state?.eqpTypeCode
        )
    )
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
                    EditMode={EditMode}
                    setState={setState}
                    config={config}
                />
            </Grid>
            <>
                <Grid container spacing={2} mt={3}>
                    {state?.Template && state?.batchDetails?.initiateDate && (
                        <Grid item xs={12}>
                            <DescriptionHeader sx={{ backgroundColor: "#4b9dea" }}>
                                <Box display='flex' justifyContent='space-between' color='white'>
                                    <Typography>
                                        Template: {`${state?.Template?.tempCode} - ${state?.Template?.tempDesc}`}
                                    </Typography>
                                    <Typography>
                                        Batch Initiate Date: {DateTime.fromISO(state?.batchDetails?.initiateDate).toFormat('dd-MMMM-yyyy')}
                                    </Typography>
                                </Box>
                            </DescriptionHeader>
                        </Grid>
                    )}
                    <Grid container spacing={2} item lg={6} md={12} sm={12} xs={12}>
                        <Grid item xs={12} md={6} lg={6}>
                            <AutoComplete width={'100%'} label="Equipment Type"
                                options={EquipmentTypes || []}
                                getOptionLabel={(option) => `${option.eqpTypeCode} | ${option.eqpTypeDesc}`}
                                value={state.eqpTypeCode}
                                name='eqpTypeCode'
                                placeholder="search..."
                                onChange={handleInput}
                                error={false}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <AutoComplete width={'100%'} label="Equipment"
                                options={Equipments?.filter((equip) => equip.insTypeCode === state?.selectedEquipType?.eqpTypeCode) || []}
                                getOptionLabel={(option) => `${option.insCode} | ${option.insName}`}
                                value={state.insCode}
                                name={'insCode'}
                                placeholder="search..."
                                onChange={handleInput}
                                error={false}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <CustomDatePicker
                                width="100%"
                                label="Cal. Due Date"
                                value={Equipment.calDueDate}
                                onChange={handleEquipment}
                                error={false} // true or false
                                required
                                size="small"
                                name='calDueDate'
                                helperText="Please select a date"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <InputField
                                fullWidth
                                disabled={state?.selectedEquipType?.cltrApp === 'N' || false}
                                name='cltr'
                                label='CLTR'
                                onChange={handleEquipment}
                                value={Equipment.cltr}
                                size='small'
                                required />
                        </Grid>
                        <Grid item xs={12}>
                            <InputField
                                required
                                multiline rows={5}
                                fullWidth
                                name='comments'
                                onChange={handleEquipment}
                                label='Comments'
                                value={Equipment.comments}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent={'flex-end'}>
                            <CustomButton startIcon={<Add />} onClick={handleAddEquipment}>Add Equipment</CustomButton>
                        </Grid>
                    </Grid>
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                        <Accordion
                            title='Steps Associated With Selected Equipment Type'
                            childComponent={<CustomTable
                                data={AssociatedSteps.map((step) => ({ ...step, minimumNo: state?.selectedEquipType?.minimumNo || '' })) || []}
                                tableHeader={columns}
                                showCheckBox={false}
                                onView={handleOpenModal}
                            />}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} mt={5}>
                    <CustomTable
                        showCheckBox={false}
                        data={state.RequestBody.detail}
                        tableHeader={columns2}
                        showDeleteButton
                        onDelete={handleRemoveEquipment}
                    />
                </Grid>
            </>
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
                content={
                    <Box p={2}>
                        <DescriptionHeader sx={{ backgroundColor: "#4b9dea" }}>
                            <Box display='flex' justifyContent='space-between' color='white'>
                                <Typography>
                                    Step Code: {state?.step?.stepCode}
                                </Typography>
                                <Typography>
                                    Step Description: {state?.step?.stepDesc}
                                </Typography>
                            </Box>
                        </DescriptionHeader>
                        <Typography variant="body1" paragraph>
                            Step Details: {state?.step?.stepDetailsRTF}
                        </Typography>
                        <Typography variant="body1" paragraph >
                            <div dangerouslySetInnerHTML={{ __html: state?.step?.stepDetailsHTML }}></div>
                        </Typography>
                    </Box>
                }
                width={650}
                height={680}
            />
        </Paper>
    )
}
const columns = [
    { field: 'stepCode', label: 'Step Code', },
    { field: 'stepDesc', label: 'Description', flex: 1 },
    { field: 'minimumNo', label: 'Minimum # of Equipment', flex: 1 },
]
const columns2 = [
    { id: 'equipmentTypeCode', label: 'Equipment Type', field: 'equipmentTypeCode' },
    { id: 'equipmentCode', label: 'Equipment', field: 'equipmentCode' },
    { id: 'serialNo', label: 'Serial #', field: 'serialNo' },
    { id: 'calDueDate', label: 'Cal. Due Date', field: 'calDueDate' },
    { id: 'cltr', label: 'CLTR #', field: 'cltr' },
    { id: 'comments', label: 'Comments', field: 'comments' },
]
export default AssignEquipment;