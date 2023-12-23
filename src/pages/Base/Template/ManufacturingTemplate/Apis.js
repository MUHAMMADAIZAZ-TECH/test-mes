import api from "../../../../api/api";
import { DateTime } from "luxon";
import { Delete, Edit } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { exportPDF, fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const updateTemplate = async ({
    body,
    handleSnackbarOpen,
    navigate,
}) => {
    try {
        const response = await api.put(`/Template/${body.tempCode}`, body);
        if (response.status === 200) {
            handleSnackbarOpen("success", "Template updated succesfully!");
            // navigate('/template/manufacturing-template')
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
};

export const deleteTemplate = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/Template/${body.tempCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Template deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.tempCode,
        row.tempDesc,
        row.sopNo,
        row.revisionNo,
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
        { field: 'tempCode', headerName: 'Code', flex: 1 },
        { field: 'tempDesc', headerName: 'Description', flex: 1 },
        { field: 'sopNo', headerName: 'Sop NO#', flex: 1 },
        { field: 'revisionNo', headerName: 'Revision NO#', flex: 1 },
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
export const regex = /^[^\s|]+/;

export const isObjectNotEmpty = (obj) => {
    return Object.keys(obj).length > 0;
};
export { fetchData };