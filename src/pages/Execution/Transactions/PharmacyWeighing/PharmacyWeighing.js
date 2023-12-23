import { Grid, Paper } from '@mui/material'
import React, { useState } from 'react'
import { CustomActionButtons,MultileRowTable } from '../../../../components'
import ProductForm from '../../ProductForm';
import { fetchPharmacyWeighing, initialState } from './api';

const PharmacyWeighing = () => {
    const [config, setconfig] = useState({ loading: false, Found: false });
    const [state, setState] = useState(initialState);
    const [selectedRows, setSelectedRows] = useState([]);
    const handleSubmit = () => {
    }
    const handleSearch = (e) => {
        if (state.batchNo && state.prodcode && state.sectionCode) {
            fetchPharmacyWeighing(state, setState, setconfig)
        }
    };
    const handleReset = () => {
        setconfig((prev) => ({ ...prev, Found: false }))
        setState(initialState);
    }
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <ProductForm
                    state={state}
                    setState={setState}
                    config={config}
                    page='InitiateBatch'
                    stage
                />
            </Grid>
            {config.Found && <Grid display={'flex'} container spacing={2} mt={5}>
                <Grid item xs={12}>
                    <MultileRowTable
                        maxHeight={400}
                        data={state.RequestBody.lot || []}
                        tableHeader={columns}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                    />
                </Grid>
            </Grid>}
            <Grid item xs={12}>
                <CustomActionButtons
                    loading={config.loading}
                    onClose={handleReset}
                    onSubmit={config.Found ? handleSubmit : handleSearch}
                    Found={config.Found}
                />
            </Grid>
        </Paper>
    )
}

const columns = [
    { field: 'seqNo', label: 'Seq.#', id: 'seqNo', },
    { field: 'ingredient', label: 'Ingredient', id: 'ingredient',},
    { field: 'ingCode', label: 'Code', id: 'ingCode', },
    { field: 'setNo', label: 'Pii Lot #', id: 'setNo', },
    { field: 'thQtyKg', label: 'ThQtykg', id: 'thQtyKg', },
    { field: 'thQtyG', label: 'ThQtyg', id: 'thQtyG',},
    { field: 'thQtyMg', label: 'ThQtymg', id: 'thQtyMg', },
    { field: 'adjstQtyKg', label: 'Adj.QtyKg', id: 'adjstQtyKg', },
    { field: 'adjstQtyG', label: 'Adj.Qtyg',id: 'adjstQtyG', },
    { field: 'adjstQtyMg', label: 'Adj.Qtymg', id: 'adjstQtyMg', },
    { field: 'acQtyKg', label: 'Act.QtyKg', id: 'acQtyKg',},
    { field: 'acQtyG', label: 'Act.Qtyg', id: 'acQtyG', },
    { field: 'acQtyMg', label: 'Act.Qtymg',id: 'acQtyMg',},
    { field: 'comments', label: 'Comments', id: 'comments', }
]

export default PharmacyWeighing;