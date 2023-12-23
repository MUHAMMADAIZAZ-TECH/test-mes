import { Grid, Paper } from '@mui/material'
import React from 'react'
import { AutoComplete, ActionButtons, CustomTable } from '../../../../components';

const ChangeIngredientLotNo = () => {
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Reference No" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Product" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Section" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Batch No" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Stage" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Ingredient Sec #" options={[]}
                        value={''}
                        inputValue={''}
                        placeholder="search..."
                        error={false}
                        required={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomTable
                        data={rows}
                        tableHeader={columns}
                        showCheckBox={false}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ActionButtons
                    loading={false}
                    onClose={() => console.log('Console')}
                    onSubmit={() => console.log('Console')}
                />
            </Grid>
        </Paper>
    )
}

const columns = [
    { field: 'ingcode', label: 'Ingredient Code', flex: 1 },
    { field: 'desc', label: 'Description', flex: 1 },
    { field: 'oldno', label: 'Old Pii Lot#', flex: 1 },
    { field: 'subseqno', label: 'Sub Seq#', flex: 1 },
    { field: 'newno', label: 'New Pii Lot#', flex: 1 },
    { field: 'comments', label: 'Comments', flex: 1 },
]
const rows = [
    {
        id: "1",
        ingcode: "0804",
        desc: "desc-0804",
        oldno: "1",
        subseqno: "2",
        newno: "54",
        comments: "aeadsdsadasdas",
    },
    {
        id: "2",
        ingcode: "0804",
        desc: "desc-0804",
        oldno: "1",
        subseqno: "2",
        newno: "54",
        comments: "aeadsdsadasdas",
    },
];
export default ChangeIngredientLotNo;
