import { Box, Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
    InputField, CustomDateTimepicker,
    CustomButton, CustomTable, ActionButtons
} from '../../../../components'
import ProductForm from '../../ProductForm';
import {
    fetchBatchEvent, UpdateBatchEvent, AddBatchEvent, initialEvent,initialState
} from './Apis';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProductBatches } from '../Apis';

const BatchEvent = ({ label }) => {
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
    const [Event, setEvent] = useState(initialEvent)
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
    const handleReset = () => {
        // setState(initialState)
        // setconfig({ loading: false, Found: false })
        navigate(-1);
    }
    const handleSearch = () => {
        if (state.sectionCode && state.prodcode && state.batchNo) {
            fetchBatchEvent(state, setState, setconfig)
        }
    }
    const handleSave = () => {
        if (state?.RequestBody?.batcheventpk) {
            UpdateBatchEvent(state)
        }
        else {
            AddBatchEvent(state)
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        setEvent((prev) => ({ ...prev, [name]: value }))
    }
    const handleAddEvent = () => {
        if (Event.eAction && Event.comments && Event.eDate && Event.eDetails) {
            const events = [...state.RequestBody.events, Event]
            setState((prev) => ({
                ...prev,
                RequestBody: { ...prev.RequestBody, events }
            }))
            setEvent(initialEvent)
        }
    }
    const handleRemoveEvent = (_, index) => {
        const UpdatedDocs = [...state.RequestBody.events]
        UpdatedDocs.splice(index, 1)
        setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, events: UpdatedDocs } }))
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
                    <Grid item xs={12} md={6}>
                        <InputField
                            multiline
                            rows={4}
                            name='eDetails'
                            value={Event.eDetails}
                            onChange={handleInput}
                            label={'Event Details'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField
                            multiline
                            rows={4}
                            value={Event.comments}
                            name='comments'
                            onChange={handleInput}
                            label={'Comments'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField
                            multiline
                            rows={4}
                            value={Event.eAction}
                            name='eAction'
                            onChange={handleInput}
                            label={'Actions'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomDateTimepicker
                            width="100%"
                            label="Date and Time"
                            value={Event.eDate}
                            name='eDate'
                            onChange={handleInput}
                            error={false} // true or false
                            required
                            size="small"
                            helperText="Please select date and time"
                        />
                        <Box
                            mt={2}
                            display='flex'
                            justifyContent='flex-end'
                        >
                            <CustomButton
                                onClick={handleAddEvent}
                                variant='contained'
                                sx={{ width: '100%',p:1.5 }}
                            >
                                Add New Event
                            </CustomButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTable
                            data={state.RequestBody.events || []}
                            tableHeader={tableHeader}
                            showCheckBox={false}
                            showDeleteButton={true}
                            onDelete={handleRemoveEvent}
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
        </Paper >
    )
}
export const tableHeader = [
    { id: "eDetails", label: "Event Details", field: "eDetails" },
    { id: "eAction", label: "Actions", field: "eAction" },
    { id: "eDate", label: "Date and Time", field: "eDate", format: { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' } },
    { id: "comments", label: "Comments", field: "comments" },
    { id: "eSignStatus", label: "ESign Status", field: "eSignStatus" },
];

export default BatchEvent;