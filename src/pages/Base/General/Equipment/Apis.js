import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import jsPDF from "jspdf";
import { exportPDF, fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const fetchEquipmentTypes = async (setEquipmentTypes, handleSnackbarOpen) => {
    try {
        const response = await api.get(`/equipmentType`);
        if (response.status === 200) {
            setEquipmentTypes(response.data)
        }
    } catch (error) {
        handleSnackbarOpen("error", "An error occured while fetching equipment types");
        console.error(error);
    }
}
export const createEquipment = async ({ body, handleSnackbarOpen, navigate }, setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.post("/equipment", body);
        if (response.status === 201) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Equipment created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateEquipment = async ({ body, handleSnackbarOpen, navigate }, setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.put(`/equipment/${body.insCode}`, body);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Equipment updated succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteEquipment = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/equipment/${body.insCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Equipment deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.insCode,
        row.insName,
        row.insTypeCode,
        row.insTypeDesc,
        row.serialNo,
        row.createdBy,
        DateTime.fromISO(row.createdOn).toLocaleString(DateTime.DATE_SHORT),
        row.lastUser,
        DateTime.fromISO(row.lastUpdate).toLocaleString(DateTime.DATE_SHORT),
    ])
    if (selectedRows.length > 0) {
        exportPDF(head, body)
    }
};
export const exportwithType = (columns, data) => {
    const doc = new jsPDF("landscape");
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const tableData = data[key];
            const head = [
                'Equipment Type Code', 'Description',
                'Equipment Code', 'Description',
                'Serial #', 'Created By', 'Created On', 'Last User', 'Last Updated']
            const rows = tableData.map((row) => [
                row.insTypeCode,
                row.insTypeDesc,
                row.insCode,
                row.insName,
                row.serialNo,
                row.createdBy,
                DateTime.fromISO(row.createdOn).toLocaleString(DateTime.DATE_SHORT),
                row.lastUser,
                DateTime.fromISO(row.lastUpdate).toLocaleString(DateTime.DATE_SHORT),
            ]);

            doc.autoTable({
                head: [head],
                body: rows,
            });
        }
    }
    doc.save(`document.pdf`);
};
export const GenerateColumns = (handleDeleteClick, handleEditClick) => (
    [
        { field: 'insCode', headerName: 'Code', flex: 1 },
        { field: 'insName', headerName: 'Description', flex: 1 },
        { field: 'insTypeCode', headerName: 'Eqp: Type', flex: 1, },
        { field: 'insTypeDesc', headerName: 'Description', flex: 1 },
        { field: 'serialNo', headerName: 'Serial #', flex: 1 },
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
export const initEquipment = {
    insCode: "",
    insName: "",
    serialNo: "",
    mfgCode: "<string>",
    model: "<string>",
    subDepCode: "<string>",
    locationCode: "<string>",
    rePersonCode: "<string>",
    supplierCode: "<string>",
    personCode: "<string>",
    insTypeCode: "",
    tenantId: "1038",
    insTypeDesc: "",
};
export const initialErrors = {
    CodeError: "",
    descError: "",
    serNoError: "",
    EquipType: "",
}
export { fetchData };