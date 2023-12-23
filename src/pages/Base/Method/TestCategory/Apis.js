import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF,fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";
export const createTestCatg = async ({ body, handleSnackbarOpen, navigate }) => {
    try {
        const response = await api.post("/TestCategory", body);
        if (response.status === 201) {
            handleSnackbarOpen("success", "Test category succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateTestCatg = async ({ body, handleSnackbarOpen, navigate }) => {
    try {
        const response = await api.put(`/TestCategory/${body.testCateCode}`, body);
        if (response.status === 200) {
            handleSnackbarOpen("success", "Test category updated succesfully!");
            navigate(-1)
        }
    }catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteTestCatg = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/TestCategory/${body.testCateCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Test category deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.testCateCode,
        row.testCateDesc,
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
        { field: 'testCateCode', headerName: 'Code', flex: 1 },
        { field: 'testCateDesc', headerName: 'Description', flex: 1 },
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
export const initTestCatg = {
    testCateCode: "",
    testCateDesc: "",
    tenantId: "1038",
  };
export const initialErrors = {
    CodeError: "",
    descError: "",
}
export { fetchData };