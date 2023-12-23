import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const fetchBatchClosure = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/BatchClosure/${state.sectionCode}/${state.prodcode}/${state.batchNo}`);
        setLoading({ loading: false, Found: true })
        if (response.status === 200) {
            setState((prev) => ({ ...prev, RequestBody: response.data }))
        }
    } catch ({ response }) {
        if (response.status !== 404) {
            setLoading({ loading: false, Found: false })
            console.error(response);
        }
        else {
            setLoading({ loading: false, Found: true })
            console.error(response);
        }
    }
}
export const fetchBatchStatuses = async (setState) => {
    try {
        const response = await api.get(`/BatchStatus`);
        if (response.status === 200) {
            setState(response.data || [])
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchProductDetail = async (state, setState) => {
    try {
        const response = await api.get(`/ProductMPR/ProductDetail/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, productDetails: response.data }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}

export const UpdateBatchClosure = async (state) => {
    try {
        const response = await api.put(`/BatchClosure`, state.RequestBody);
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const DeleteBatchClosure = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/BatchClosure/${body.id}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Batch Closure deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}

export const AddBatchClosure = async (state) => {
    try {
        const response = await api.post(`/BatchClosure`, {
            ...state.RequestBody,
            "sectionCode": state?.sectionCode,
            "productCode": state?.prodcode,
            "batchNo": state?.batchNo,
            "mfgDate": state?.batchDetails?.mfgDate || "",
            "batchUnit": state?.productDetails?.unit || "",
            "eSignStatus": "",
            "tenantId": "1038",
        });
        if (response.status === 201) {
            console.log(response.data);
        }
    } catch (error) {
        console.error(error);
    }
}

export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.batchNo,
        row.productCode,
        row.sectionCode,
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
        { field: 'sectionCode', headerName: 'Section Code', flex: 1 },
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
                        icon={<Delete />}
                        label="Delete"
                        title="Delete"
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
    productDetails: null,
    batchDetails: null,
    RequestBody: {
        "sectionCode": "",
        "productCode": "",
        "batchNo": "",
        "acYield": "",
        "mfgDate": "",
        "comments": "",
        "batchStatus": "",
        "bthClDate": "",
        "batchUnit": "",
        "eSignStatus": "",
        "tenantId": "1038",
    }
}
