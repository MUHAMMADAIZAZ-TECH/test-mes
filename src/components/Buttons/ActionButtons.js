import { Box, Stack } from '@mui/material'
import React from 'react'
import { CustomButton, CustomLoadingButton } from './Buttons'
import { Close, PrintOutlined, Save, Search, Update, Delete } from '@mui/icons-material'

const ActionButtons = ({
    loading,
    onSubmit,
    onClose,
    action,
    handlePrint,
    containerStyle,
    justifyContent,
    disabled,
    onDelete
}) => {
    return (
        <Box sx={{ marginTop: 3, ...containerStyle }}>
            <Stack spacing={1} direction="row" justifyContent={justifyContent}>
                {action && handlePrint && <CustomButton
                    disabled={loading && loading}
                    backgroundColor="#3498DB"
                    variant="contained"
                    onClick={handlePrint}
                    startIcon={<PrintOutlined />}
                >
                    Print
                </CustomButton>}
                <CustomLoadingButton
                    disabled={disabled || !onSubmit}
                    loading={loading}
                    loadingPosition={"start"}
                    backgroundColor="#28B463"
                    variant="contained"
                    onClick={onSubmit}
                    startIcon={action ? <Update /> : <Save />}
                >
                    {action ? 'Update' : 'Save'}

                </CustomLoadingButton>
                {onDelete && action && <CustomButton
                    backgroundColor="#E74C3C"
                    variant="contained"
                    disabled={(loading && loading) || disabled}
                    startIcon={<Delete />}
                    onClick={onDelete}
                >
                    Delete
                </CustomButton>}
                <CustomButton
                    disabled={(loading && loading) || disabled}
                    backgroundColor="#E74C3C"
                    variant="contained"
                    onClick={onClose}
                    startIcon={<Close />}
                >
                    Close
                </CustomButton>
            </Stack>
        </Box>
    )
}
const CustomActionButtons = ({
    loading,
    onSubmit,
    onClose,
    sx,
    Found,
    justifyContent = 'flex-start',
    onDelete,
    mode
}) => {
    return (
        <Box sx={{ marginTop: 3, ...sx }}>
            <Stack spacing={1} direction="row" justifyContent={justifyContent}>
                <CustomLoadingButton
                    loading={loading}
                    loadingPosition={"start"}
                    backgroundColor="#28B463"
                    variant="contained"
                    onClick={onSubmit}
                    startIcon={Found ? <Save /> : <Search />}
                >
                    {Found ? 'Save' : 'Search'}
                </CustomLoadingButton>
                {onDelete && mode && <CustomButton
                    backgroundColor="#E74C3C"
                    variant="contained"
                    disabled={loading && loading}
                    startIcon={<Delete />}
                    onClick={onDelete}
                >
                    Delete
                </CustomButton>}
                <CustomButton
                    disabled={loading && loading}
                    backgroundColor="#E74C3C"
                    variant="contained"
                    onClick={onClose}
                    startIcon={<Close />}
                >
                    Close
                </CustomButton>
            </Stack>
        </Box>
    )
}
export { CustomActionButtons };
export default ActionButtons;