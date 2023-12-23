import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF,fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const createUnitOpr = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.post("/UnitOperation", body);
        if (response.status === 201) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Unit operation created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateUnitOpr = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.put(`/UnitOperation/${body.mpUnitCode}`, body);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Unit operation updated succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteUnitOpr = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/UnitOperation/${body.mpUnitCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Unit operation deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.mpUnitCode,
        row.mpUnitDesc,
        (row.status === 'Y' ? "YES" : "NO"),
        row.comments,
        row.createdBy,
        DateTime.fromISO(row.createdOn).toLocaleString(DateTime.DATE_SHORT),
        row.lastUser,
        DateTime.fromISO(row.lastUpdate).toLocaleString(DateTime.DATE_SHORT),
    ])
    if (selectedRows.length > 0) {
        exportPDF(head, body)
    }
}
export const GenerateColumns = (handleDeleteClick, handleEditClick) => (
    [
        { field: 'mpUnitCode', headerName: 'Code', flex: 1 },
        { field: 'mpUnitDesc', headerName: 'Description', flex: 1 },
        {
            field: 'status', headerName: 'Status', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO")
        },
        { field: 'comments', headerName: 'Comments', flex: 1 },
        { field: 'createdBy', headerName: 'Created By', flex: 1 },
        {
            field: 'createdOn',
            headerName: 'Created On',
            flex: 1,
            type: 'date',
            valueFormatter: (params) => {
                const date = DateTime.fromISO(params.value);
                return date.toLocaleString(DateTime.DATE_SHORT); // Customize the format
            },
        },
        { field: 'lastUser', headerName: 'Last User', flex: 1 },
        {
            field: 'lastUpdate',
            headerName: 'Last Updated',
            flex: 1,
            type: 'date',
            valueFormatter: (params) => {
                const date = DateTime.fromISO(params.value);
                return date.toLocaleString(DateTime.DATE_SHORT); // Customize the format
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ row }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={handleDeleteClick(row)}
                        color="inherit"
                    />,
                ];
            },
        },
    ]
)
export const initUnitOpr = {
    mpUnitCode: "",
    mpUnitDesc: "",
    status: "",
    comments: "",
    tenantId: "1038",
  };
export const initialErrors = {
    CodeError: "",
    descError: "",
    commError: "",
}
export { fetchData };