import React, { useState } from "react";
import { Box, Grid, FormControlLabel, Switch } from '@mui/material';
import {
    exportToPDF, deleteEquipment,
    GenerateColumns, exportwithType,
} from './Apis';
import { useOutletContext } from "react-router-dom";
import { ExportDialog } from "../../../../components";
import List from "../../../../components/Layout/List";
import { groupRows } from "../../../../utils/functions";
const EQList = ({ url }) => {
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    const [state, setState] = useState({ rows: [], columns: [] });
    const [exportByGroupType, setExportByGroupType] = useState(true);
    const [openExportDialog, setOpenExportDialog] = useState(false);

    const exportPDF = (exportByGroupType) => {
        let RowsToexport = exportByGroupType ? groupRows(state.rows, 'insTypeCode') : state.rows
        if (exportByGroupType) {
            exportwithType(state.columns, RowsToexport)
        }
        else {
            exportToPDF(state.columns, RowsToexport)
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
                        deleteFunction={deleteEquipment}
                        code='insCode'
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
                <FormControlLabel
                    control={
                        <Switch
                            checked={exportByGroupType}
                            onChange={() => setExportByGroupType(!exportByGroupType)}
                            name="exportByGroupType"
                            color="primary"
                        />
                    }
                    label="Export w.r.t Equipment Type"
                />
            </ExportDialog>
        </Box>
    )
}

export default EQList;
