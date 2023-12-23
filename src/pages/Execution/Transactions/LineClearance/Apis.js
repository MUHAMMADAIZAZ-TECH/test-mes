
import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Equalizer } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchLineClearance = async (
    { state, setState },
) => {
    try {
        const response = await api.get(
            `/UnitOpLC/${state.sectionCode}/${state.prodcode}/${state.batchNo}/${state.stageCode}/${state.mpUnitCode}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, RequestBody: response.data }))
        }
    } catch (error) {
        console.error(error);
    }
}
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
export const fetchAssignAreas = async (state, setState) => {
    try {
        const response = await api.get(`/AssignArea/${state.sectionCode}/${state.prodcode}/${state.batchNo}/${state.stageCode}/${state.mpUnitCode}`);
        if (response.status === 200) {
            setState((prev) => ({
                ...prev,
                areaList: response.data.detail,
                stage: { stgLevelNo: response.data.stglvl },
                UnitOp: { uoLevelNo: response.data.uolvl },
            }))
        }
    } catch (error) {
        console.error(error);
    }
}
export const fetchAreasTypesMpr = async (state, setState) => {
    try {
        const response = await api.get(`/ProductMPR/AssignAreaType/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setState((prev) => ({
                ...prev, areaTypes: response.data.assignAreaType_List,
                lineClr: response.data.lineClearance_List,
            }))
        }
    } catch (error) {
        console.error(error);
    }
}
export const fetchTemplateDetails = async (state, setstate) => {
    try {
        const response = await api.get(`/ProductMPR/TemplateDetail/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setstate(((prev) => ({ ...prev, Template: response.data })))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const ValidatedLC = async ({ state, selectedRows },
    { setSelectedRows, setisValid }) => {
    const ValidateArray = selectedRows.map((item) => ({ ...item, result: "" }))
    try {
        const response = await api.put(`/UnitOpLC/${state.sectionCode}/${state.prodcode}/${state.batchNo}/ValidatedLC`, ValidateArray);
        if (response.status === 200) {
            const isValid = response.data.every(item => item.result === "Passed")
            setSelectedRows(response.data)
            setisValid(isValid);
        }
    } catch (error) {
        setisValid(false)
        console.error(error);
    }
}
export const ValidatedLConAdd = async (
    { state, selectedRows }, setState, EditMode
) => {
    try {
        const areaType = await state.areaTypes.find((area) =>
            area.mpUnitOpCode === state.mpUnitCode).basicAreaTypeClasses.find((area) =>
                area.lcCode === state.lcCode);
        const area = await state.areaList.find((area) => (area.areaTypeCode === areaType.areaTypeCode));
        const Body = {
            "setNo": "1",
            "areaCode": area.areaCode,
            "areaDesc": "this is description",
            "lccode": areaType.lcCode,
            "lcdesc": areaType.lcDesc,
            "lcReqd": areaType.lcReqd,
            "validated": false,
            "lstLCTests": selectedRows
        }
        const response = await api.put(
            `/UnitOpLC/${state.sectionCode}/${state.prodcode}/${state.batchNo}/${state.stageCode}/${state.mpUnitCode}/LineClearanceList`, Body);
        if (response.status === 200) {
            setState((prev) => ({
                ...prev, RequestBody: {
                    ...prev.RequestBody,
                    unitLCClasses: EditMode ? response.data : [Body]
                }
            }))
        }
       
    } catch (error) {
        console.error(error);
    }
}
export const AddLineClearance = async (state) => {
    try {
        const response = await api.post(`/UnitOpLC`, state);
        if (response.status === 200) {
            // setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, unitLCClasses: response.data } }))
            console.log(response);
        }
    } catch (error) {
        console.error(error);
    }
}
export const UpdateLineClearance = async (state) => {
    try {
        const response = await api.put(`/UnitOpLC`, state);
        if (response.status === 200) {
            // setState((prev) => ({ ...prev, RequestBody: { ...prev.RequestBody, unitLCClasses: response.data } }))
            console.log(response);
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
        row.tempCode,
        row.stageCode,
        row.unitCode,
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
        { field: 'tempCode', headerName: 'Template Code', flex: 1 },
        { field: 'stageCode', headerName: 'Stage Code', flex: 1 },
        { field: 'unitCode', headerName: 'Unit Operation Code', flex: 1 },
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
                        icon={<Equalizer />}
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
    lcCode: "",
    areaList: [],
    areaTypes: [],
    lineClr: [],
    RequestBody: {
        "sectionCode": "",
        "productCode": "",
        "tempCode": "",
        "batchNo": "",
        "stageCode": "",
        "unitCode": "",
        "stgLvl": "",
        "unitLvl": "",
        "unitLCClasses": [],
        "eSignStatus": "string",
        "tenantId": "1038",
    }
}

const example = {
    "setNo": "1",
    "areaCode": "BD-04",
    "areaDesc": "",
    "lccode": "LC101",
    "lcdesc": "Line Clearance Routine 1",
    "lcReqd": "Y",
    "validated": false,
    "lstLCTests": [
        {
            "testCode": "tst01",
            "testDesc": "test demo",
            "limitsApp": "Y",
            "value1": "20",
            "value2": "-",
            "operater": "=",
            "mandatory": "N",
            "result": "",
            "testVal": "",
            "comments": ""
        }
    ]
}
export const columns = [
    { field: 'areaCode', label: 'Area Code', id: 'areaCode', },
    // { field: 'areaTypeCode', label: 'Area Type Code', flex: 1 },
]
export const columns2 = [
    { field: 'lccode', label: 'Line Clearance Code', id: 'lccode' },
    { field: 'lcdesc', label: 'Description', id: 'lcdesc' },
    { field: 'sopno', label: 'Sop#', id: 'sopno' },
    { field: 'revdate', label: 'Revision Date', id: 'revdate' },
]
export const columns3 = [
    { field: 'setNo', label: 'Set No', id: 'setNo' },
    { field: 'areaCode', label: 'Area Code', id: 'areaCode' },
    { field: 'areaDesc', label: 'Area Description', id: 'areaDesc' },
    { field: 'lccode', label: 'Line Clearance Code', id: 'lccode' },
    { field: 'lcdesc', label: 'Description', id: 'lcdesc' },
    { field: 'lcReqd', label: 'LC Required', id: 'lcReqd' },
]
export const TestHeader = [
    { field: 'testCode', label: 'Test Code', id: 'testCode' },
    { field: 'testDesc', label: 'Test Description', id: 'testDesc' },
    { field: 'limitsApp', label: 'Limit Applicable', id: 'limitsApp' },
    { field: 'operater', label: 'Operations', id: 'operater' },
    { field: 'value1', label: 'Limit 1', id: 'value1' },
    { field: 'value2', label: 'Limit 2', id: 'value2' },
    { field: 'validation', label: 'Validation / Verfication', id: 'validation' },
    { field: 'testVal', label: 'values', id: 'testVal' },
    { field: 'comments', label: 'Comments', id: 'comments' }
]