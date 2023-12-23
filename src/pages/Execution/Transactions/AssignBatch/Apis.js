import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Start } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchAssignBatchToProduct = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/AssignBatchToProduct/${state.sectionCode}/${state.prodcode}/${state.batchNo}`);
        if (response.status === 200) {
            setState({
                ...state, RequestBody: { ...response.data },
                tempCode: response.data.template,
                thYield: response.data.thYield,
                custID: response.data.customerID
            })
            setLoading({ loading: false, Found: true })
        }
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const fetchProductDetails = async (state, setState) => {
    try {
        const response = await api.get(`/ProductMPR/ProductDetail/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setState((prev) => ({
                ...prev,
                productDetails: { ...response.data },
                thYield: response.data.batchsize,
                custID: response.data.customer.custID
            }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchTemplates = async (id, setTemplates) => {
    try {
        const res = await api.get(`/Product/${id}/TempCode`);
        if (res.status === 200) {
            setTemplates(res.data);
        }
    } catch (error) {
        console.error(error);
    }
}


export const fetchClients = async (setState) => {
    try {
        const response = await api.get(`/customer`);
        if (response.status === 200) {
            setState(response.data)
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchBatchTypes = async (setState) => {
    try {
        const response = await api.get(`/batchType`);
        if (response.status === 200) {
            setState(response.data)
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const AddAssignBatch = async (body) => {
    try {
        const response = await api.post("/AssignBatchToProduct", body);
        if (response.status === 201) {
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const UpdateAssignBatch = async (body) => {
    try {
        const response = await api.put(`/AssignBatchToProduct`, body);
        if (response.status === 200) {
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
                        icon={<Start />}
                        label="Initiate Batch"
                        title="Initiate Batch"
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
    products: [],
    product: null,
    productDetails: null,
    sectionCode: '',
    batchNo: "",
    template: "",
    tempCode: "",
    custID: "",
    thYield: "",
    RequestBody: {
        "sectioncode": "",
        "productCode": "",
        "batchNo": "",
        "template": "",
        "batchType": "",
        "batchStatus": "",
        "customerID": "",
        "initiateDate": DateTime.now(),
        "thYield": "",
        "acYield": "",
        "executionType": "A",
        "batchProgress": "",
        "domRemarks": "",
        "comments": "",
        "mfgDate": "",
        "eSignStatus": "",
        "createdBy": "",
        "createdOn": "",
        "lastUser": "",
        "lastUpdate": "",
        "id": "",
        "tenantId": "1038",
    }
}