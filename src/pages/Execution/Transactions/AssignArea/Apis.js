import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Construction, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchAssignBatchToProduct = async (state, batchNo, setState) => {
    try {
        const response = await api.get(`/AssignBatchToProduct/${state.sectionCode}/${state.prodcode}/${batchNo}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, batchDetails: { ...response.data } }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchTemplateDetails = async (state, setstate,getAvailableAreas) => {
    try {
        const response = await api.get(`/ProductMPR/TemplateDetail/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setstate(((prev) => ({ ...prev, Template: response.data })))
            if(getAvailableAreas){
                getAvailableAreas()
            }
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchAssignAreas = async (state, setState, setLoading,setSelectedRows) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/AssignArea/${state.sectionCode}/${state.prodcode}/${state.batchNo}/${state.stageCode}/${state.mpUnitCode}`);
        setLoading({ loading: false, Found: true })
        if (response.status === 200) {
            setState((prev) => ({
                ...prev, RequestBody: response.data,
                // areaList: [...prev.areaList, ...response.data.detail]
            }))
            setSelectedRows(response.data.detail)
        }
    } catch (error) {
        setLoading({ loading: false, Found: false })
        console.error(error);
    }
}
export const fetchAreasList = async (state, setState) => {
    try {
        const response = await api.get(`/AssignArea/area/${state.sectionCode}/${state.prodcode}/${state.tempCode}/${state.mpUnitCode}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, areaList: [...response.data] }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const UpdateAssignAreas = async (state, detail) => {
    try {
        const response = await api.put(`/AssignArea`, { ...state.RequestBody, detail });
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const AddAssignAreas = async (state, detail) => {
    try {
        const response = await api.post(`/AssignArea`, {
            "sectionCode": state.sectionCode,
            "productCode": state.prodcode,
            "batchNo": state.batchNo,
            "uoCode": state.mpUnitCode,
            "stagecode": state.stageCode,
            "stglvl":  state.stage.stgLevelNo,
            "uolvl": state.UnitOp.uoLevelNo,
            "detail": detail || [],
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
        row.stageCode,
        row.uoCode,
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
        { field: 'stageCode', headerName: 'Stage Code', flex: 1 },
        { field: 'uoCode', headerName: 'Unit Operation Code', flex: 1 },
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
                        icon={<Construction />}
                        label="Assign Equipment"
                        title="Assign Equipment"
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
    batchDetails: null,
    tempCode: '',
    Template: null,
    product: null,
    stageCode: "",
    mpUnitCode: "",
    stage: null,
    UnitOp: null,
    areaList: [],
    RequestBody: {
        "sectionCode": "",
        "productCode": "",
        "batchNo": "",
        "uoCode": "",
        "stagecode": "",
        "stglvl": "",
        "uolvl": "",
        "detail": [],
        "tenantId": "",
        "createdBy": "",
        "createdOn": "",
        "lastUser": "",
        "lastUpdate": "",
    }
}
