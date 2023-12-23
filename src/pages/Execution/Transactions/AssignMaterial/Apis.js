import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, RoomPreferences, Start } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchAssignMaterial = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/AssignMaterial/${state.sectionCode}/${state.prodcode}/${state.batchNo}/${state.stageCode}`);
        setLoading({ loading: false, Found: true })
        if (response.status === 200) {
            setState({ ...state, RequestBody: response.data })
        }
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const UpdateAssignMaterial = async (state) => {
    console.log(state);
    try {
        const response = await api.put(`/AssignMaterial`, state);
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const AddAssignMaterial = async (state) => {
    try {
        const response = await api.post(`/AssignMaterial`, state);
        if (response.status === 201) {
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
                        icon={<RoomPreferences />}
                        label="Assign Area"
                        title="Assign Area"
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
    stageCode: "",
    StageQty: null,
    RequestBody: {
        "sectionCode": "",
        "productCode": "",
        "batchNo": "",
        "stageCode": "",
        "stdQty": "",
        "eSignStatus": "",
        "ing": [],
        "tenantId": "1038",
        "lastUser": "",
        "lastUpdate": "",
        "createdBy": "",
        "createdOn": "",
    }
}
const example = {
    "seqNo": "1",
    "ingCode": "PD-02",
    "ingDesc": "PROD 2",
    "expDate": "string",
    "reDate": "string",
    "qtyUnitMg": "0",
    "ww": "N",
    "qtyKg": "0",
    "qtyG": "0",
    "qtyMg": "0",
    "thQtyKg": "0",
    "thQtyG": "500",
    "thQtyMg": "0",
    "lotBreakable": "Y",
}
export const InitialLot = {
    comments: "",
    lotNo: "",
    subSeq: "",
    thQtyG: "",
    thQtyKg: "",
    thQtyMg: ""
}