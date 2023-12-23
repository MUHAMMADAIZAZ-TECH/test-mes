import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, UploadFile } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchDateOfManufacturing = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/DateOfManufacturing/${state.prodcode}/${state.sectionCode}/${state.batchNo}`);
        setLoading({ loading: false, Found: true })
        setState((prev) => ({ ...prev, RequestBody: response.data || { ...prev.RequestBody } }))
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const UpdateDateOfManufacturing = async (state) => {
    try {
        const response = await api.put(`/DateOfManufacturing`, state);
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}

export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.batchNo,
        row.productCode,
        row.sectioncode,
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
        { field: 'batchNo', headerName: 'Batch No', flex: 1 },
        { field: 'productCode', headerName: 'Product Code', flex: 1 },
        { field: 'sectioncode', headerName: 'Section Code', flex: 1 },
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
                        title="Edit"
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<UploadFile />}
                        label="Document Upload"
                        title="Document Upload"
                        onClick={handleDeleteClick(row)}
                        color="inherit"
                    />,
                ];
            },
        },
    ]
)
export const initialState = {
    prodcode: '',
    sectionCode: '',
    batchNo: "",
    tempCode: '',
    Template: null,
    product: null,
    RequestBody: {
        "productCode": "",
        "sectioncode": "",
        "batchNo": "",
        "comments": "",
        "mfgDate": "",
        "lastUser": "",
        "lastUpdate": "",
        "createdBy": "",
        "createdOn": "",
        "tenantId": "1038",
        "batchinitiationpk": "",
    }
}
