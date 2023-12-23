import { Box, Grid, Paper, Stack } from '@mui/material'
import React, { useState } from 'react'
import { AutoComplete, CustomButton } from '../../../../components'
import { Preview, Restore } from '@mui/icons-material';

const BatchReview = () => {
    return (
        <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
           <Grid container spacing={2}>
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
                <Grid item xs={12} md={12} lg={12}>
                    <Box>
                        <Stack spacing={1} direction="row" justifyContent={"flex-end"}>
                            <CustomButton
                                backgroundColor="#28B463"
                                variant="contained"
                                startIcon={<Preview />}
                            >
                                Preview
                            </CustomButton>
                            <CustomButton
                                backgroundColor="#E74C3C"
                                variant="contained"
                                startIcon={<Restore />}
                            >
                                Close
                            </CustomButton>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default BatchReview;