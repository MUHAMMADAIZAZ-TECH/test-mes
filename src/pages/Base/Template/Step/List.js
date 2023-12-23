import React, { useState } from "react";
import { Box, Grid, Switch, FormControlLabel } from '@mui/material';
import {  deleteStep,exportWithcategory, GenerateColumns, exportToPDF } from './Apis';
import { useOutletContext } from "react-router-dom";
import List from '../../../../components/Layout/List';
import { ExportDialog } from "../../../../components";
import { groupRows } from "../../../../utils/functions";

const StepList = ({ url }) => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    const [exportByGroupType, setExportByGroupType] = useState(true);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [state, setState] = useState({ rows: [], columns: [] });
    const exportPDF = (exportByGroupType) => {
        let RowsToexport = exportByGroupType ? groupRows(state.rows, 'stepCateCode') : state.rows
        if(exportByGroupType){
            exportWithcategory(state.columns,RowsToexport)
        }
        else{
            exportToPDF(state.columns,RowsToexport)
        }
    }

    const handleExportDialogOpen = (columns, rows) => {
        setState({ rows, columns })
        setOpenExportDialog(true);
    }

    const handleExportDialogClose = () => {
        setOpenExportDialog(false);
    }

    const handleExportConfirm = () => {
        setOpenExportDialog(false);
        exportPDF(exportByGroupType);
    }
    return (
        <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <List
                        generateColumns={GenerateColumns}
                        url={url}
                        exportToPDFFunction={handleExportDialogOpen}
                        deleteFunction={deleteStep}
                        code='stepCode'
                        handleSnackbarOpen={handleSnackbarOpen}
                        handleAction={handleAction}
                    />
                </Grid>
            </Grid>
            <ExportDialog
                open={openExportDialog}
                onClose={handleExportDialogClose}
                onConfirm={handleExportConfirm}
                Confirmtext={'Export'}
                Canceltext={'Cancel'}
                Title={'Export Options'}
            >
              <Box display='flex' flexDirection='column'>
              <FormControlLabel
                    control={
                        <Switch
                            checked={exportByGroupType}
                            onChange={() => setExportByGroupType(!exportByGroupType)}
                            name="exportByGroupType"
                            color="primary"
                        />
                    }
                    label="Export Step w.r.t Category"
                />
              </Box>
            </ExportDialog>
        </Box>
    )
}

export default StepList;