import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF, fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const createSection = async ({ body, handleSnackbarOpen, navigate }, setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.post("/section", body);
        if (response.status === 201) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Section created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateSection = async ({ body, handleSnackbarOpen, navigate }, setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.put(`/section/${body.sectionCode}`, body);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Section updated succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteSection = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/section/${body.sectionCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Section deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.sectionCode,
        row.sectionDesc,
        (row.clientInfoReqd === 'Y' ? "YES" : "NO"),
        (row.expiryDateReqd === 'Y' ? "YES" : "NO"),
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
        { field: 'sectionCode', headerName: 'Code', flex: 1 },
        { field: 'sectionDesc', headerName: 'Description', flex: 1 },
        {
            field: 'clientInfoReqd',
            headerName: 'Cust Required',
            flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO")
        },
        {
            field: 'expiryDateReqd',
            headerName: 'Exp Date Required',
            flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO")
        },
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
export const initSection = {
    sectionCode: "",
    sectionDesc: "",
    tenantId: "1038",
    createdby: "demouser",
    lastuser: "demouser",
    companyid: "1038",
    createdon: new Date(),
    lastupdate: new Date(),
    applicableForProduct: "N",
    expiryDateReqd: "N",
    clientInfoReqd: "N",
};
export const initialErrors = {
    CodeError: "",
    descError: "",
}
export { fetchData }