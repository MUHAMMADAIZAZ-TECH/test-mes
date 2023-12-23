import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { AddToPhotos, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchInitiateBatch = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/InitiateBatch/${state.sectionCode}/${state.prodcode}/${state.batchNo}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, ...response.data } }))
            setLoading({ loading: false, Found: true })
        }
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const AddInitiateBatch = async (body) => {
    try {
        const response = await api.post("/InitiateBatch", body);
        if (response.status === 201) {
            console.log(response);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const UpdateInitiateBatch = async (body) => {
    try {
        const response = await api.put(`/InitiateBatch`, body);
        if (response.status === 200) {
            console.log(response);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const DeleteInitiateBatch = async (body) => {
    try {
        const response = await api.delete(`/AssignBatchToProduct/${body.areaCode}`);
        if (response.status === 204) {
            console.log(response);
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
        DateTime.fromISO(row.mfgDate).toLocaleString(DateTime.DATE_SHORT),
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
        { field: 'batchNo', headerName: 'Batch No', flex: 1 },
        { field: 'productCode', headerName: 'Product Code', flex: 1 },
        { field: 'sectioncode', headerName: 'Section Code', flex: 1 },
        {
            field: 'mfgDate', headerName: 'Initiate Date', flex: 1,
            type: 'date',
            valueFormatter: (params) => {
                const date = DateTime.fromISO(params.value);
                return date.toLocaleString(DateTime.DATE_SHORT); // Customize the format
            }
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
                        title="Edit"
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        title="Assign Material"
                        icon={<AddToPhotos />}
                        label="Assign Material"
                        className="textPrimary"
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
    product: null,
    sectionCode: '',
    batchNo: "",
    tempCode: "",
    batchDetails: null,
    RequestBody: {
        sectioncode: "",
        productCode: "",
        batchNo: "",
        templateCode: null,
        comments: "",
        mfgDate: "",
        thYield: "",
        eSignStatus: "",
        createdBy: "",
        createdOn: "",
        lastUser: "",
        lastUpdate: "",
        id: "",
        tenantId: "1038",
        batchinitiationpk: "",
        isdeleted: false
    }
}
