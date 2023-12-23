import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { CustomButton } from '../Buttons/Buttons';

function ExportDialog({ Title, open, onClose, onConfirm, children, Canceltext, Confirmtext }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{Title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <CustomButton color="#28B463" variant="contained" onClick={onConfirm}>
                    {Confirmtext}
                </CustomButton>
                <CustomButton onClick={onClose} color="primary" backgroundColor="#E74C3C"
                    variant="contained">
                    {Canceltext}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
}

export default ExportDialog;
