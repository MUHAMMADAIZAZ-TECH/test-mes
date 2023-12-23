import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF, fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const fetchAreaTypes = async (setAreaTypes, handleSnackbarOpen) => {
    setAreaTypes((prev) => ({ ...prev, loading: true, error: null }))
    try {
        const response = await api.get("/areaType");
        if (response.data) {
            const data = response.data.map((item) => ({
                areaTypeCode: item.areaTypeCode,
                areaTypeDesc: item.areaTypeDesc,
            }));
            setAreaTypes({ loading: false, data, error: null });
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.fetchError);
        setAreaTypes({ loading: false, data: [], error: response });
        console.error(response);
    }
}
export const createArea = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.post("/area", body);
        if (response.status === 201) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Area created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateArea = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.put(`/area/${body.areaCode}`, body);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Area updated succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteArea = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/area/${body.areaCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Area deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.areaCode,
        row.areaDesc,
        row.areaTypeCode,
        (row.applicableForManufacturingExecution === 'Y' ? "YES" : "NO"),
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
        { field: 'areaCode', headerName: 'Code', flex: 1 },
        { field: 'areaDesc', headerName: 'Description', flex: 1 },
        { field: 'areaTypeCode', headerName: 'Type Code', flex: 1 },
        {
            field: 'applicableForManufacturingExecution',
            headerName: 'Execution phase',
            flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO"),
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
export const initArea = {
    areaCode: "",
    areaDesc: "",
    areaTypeCode: "",
    areaTypeDesc: "",
    tenantId: "1038",
    applicableForManufacturingExecution: "N",
};
export const initialErrors = {
    area: "",
    description: "",
    areaTypeCode: "",
}
export { fetchData }