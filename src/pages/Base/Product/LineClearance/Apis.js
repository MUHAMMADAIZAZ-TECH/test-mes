import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF, fetchData } from "../../../../utils/functions";

export const deleteLineClr = async (lineClr, handleSnackbarOpen) => {
    try {
        const response = await api.delete(`/LineClearance/${lineClr.lccode}`);
        if (response.status === 200) {
            handleSnackbarOpen("success", "Deleted successfully!");
        }
    } catch (error) {
        console.error(error);
    }
}
export { fetchData };
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.lccode,
        row.lcdesc,
        row.sopno,
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
export const GenerateColumns = (_, handleEditClick) => (
    [
        { field: 'lccode', headerName: 'Code', flex: 1 },
        { field: 'lcdesc', headerName: 'Description', flex: 1 },
        { field: 'sopno', headerName: 'Sop #', flex: 1 },
        {
            field: 'status', headerName: 'Status', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO"),
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
                ];
            },
        },
    ]
)
export const initialState = {
    "prodcode": "",
    "prodshtname": "",
    "prodlngname": "",
    "prodcatecode": "",
    "prodcatedesc": "",
    "registrationno": "",
    "batchsize": "",
    "status": "",
    "storagecon": "",
    "unit": "",
    "lastuser": "",
    "lastupdate": "",
    "createdby": "",
    "createdon": "",
    "description": "",
    "controlSubstance": "",
    "controlSubDesc": "",
    "prodComments": "",
    "partialPh": "",
    "uoPE": "",
    "section": {
        "id": "",
        "sectionCode": "",
        "sectionDesc": "",
        "createdBy": "",
        "createdOn": "",
        "lastUser": "",
        "lastUpdate": "",
        "tenantId": "1038",
        "sectionpk": "",
        "_etag": "",
        "isdeleted": false,
        "clientInfoReqd": "",
        "expiryDateReqd": "",
        "applicableForProduct": ""
    },
    "customerCode": "",
    "customerDesc": "",
    "expiryMonth": "",
    "tenantId": "",
    "productpk": "",
    "_etag": "",
    "isdeleted": false
}