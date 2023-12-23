import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Grading } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchAssignEquipment = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/AssignEquipment/${state.sectionCode}/${state.prodcode}/${state.tempCode}/${state.batchNo}`);
        setLoading({ loading: false, Found: true })
        if (response.status === 200) {
            setState((prev) => ({ ...prev, RequestBody: response.data }))
        }
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const fetchEquipmentTypes = async (state, setState) => {
    try {
        const response = await api.get(`/ProductMPR/AssignEqpType/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, equipmentTypeList: response.data.assignEquipmentTypes_List || [] }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchEquipments = async (setState) => {
    try {
        const response = await api.get(`/Equipment`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, equipmentList: response.data || [] }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchAreasList = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/AssignArea/area/${state.sectionCode}/${state.prodcode}/${state.tempCode}/${state.uoCode}`);
        setLoading({ loading: false, Found: true })
        if (response.status === 200) {
            setState((prev) => ({ ...prev, areaList: [...prev.areaList, ...response.data] }))
        }
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const fetchEquipment = async (id, setState) => {
    try {
        const response = await api.get(`/EquipmentType/${id}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, selectedEquipType: { ...prev.selectedEquipType, ...response.data } }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchStep = async (id, setState, openModal) => {
    try {
        const response = await api.get(`/Step/${id}`);
        if (response.status === 200) {
            openModal()
            setState((prev) => ({ ...prev, step: response.data }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}

export const UpdateAssignEquipment = async (state) => {
    try {
        const response = await api.put(`/AssignEquipment`, state.RequestBody);
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const AddAssignEquipment = async (state) => {
    try {
        const response = await api.post(`/AssignEquipment`, {
            "sectionCode": state.sectionCode,
            "productCode": state.prodcode,
            "templateCode": state.tempCode,
            "batchNo": state.batchNo,
            "detail": state.RequestBody.detail,
            "tenantId": "1038",
        });
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
                        icon={<Grading />}
                        label="Assign Equipment"
                        title="Line Clearance"
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
    stageCode: "",
    mpUnitCode: "",
    stage: null,
    UnitOp: null,
    batchDetails: null,
    equipmentTypeList: [],
    eqpTypeCode: "",
    selectedEquipType: null,
    equipmentList: [],
    selectedEquipment: null,
    insCode: "",
    step: null,
    RequestBody: {
        "sectionCode": "",
        "productCode": "",
        "templateCode": "",
        "batchNo": "",
        "detail": [],
        "tenantId": "1038",
        "createdBy": "",
        "createdOn": "",
        "lastUser": "",
        "lastUpdate": "",
    }
}
export const initialEquipment = {
    equipmentTypeCode: "",
    equipmentCode: "",
    serialNo: "<string>",
    calDueDate: '',
    cltr: "",
    comments: ""
}