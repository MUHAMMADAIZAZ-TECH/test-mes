import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF ,fetchData} from "../../../../utils/functions";
import jsPDF from "jspdf";
import { ERROR_MESSAGES } from "../../../../utils/constants";
export const fetchStepCategories = async (setstate,handleSnackbarOpen) => {
    try {
        const response = await api.get("/StepCategory");
        if (response.data) {
            const data = response.data.map((item) => ({
                stepCateCode: item.stepCateCode,
                stepCateDesc: item.stepCateDesc,
            }));
            setstate(data);
        }
    } catch ({response}) {
        handleSnackbarOpen('error','An error occured while fetching step categories')
        console.error(response);
    }
}
export const fetchRawData = async (setstate,handleSnackbarOpen) => {
    try {
        const response = await api.get("/RawData");
        if (response.data) {
            setstate(
                response.data.map((opt) => {
                    opt.label = `${opt.testDataCode} - ${opt.testDataDesc}`;
                    return opt;
                })
            );
        }
    } catch ({response}) {
        handleSnackbarOpen('error','An error occured while fetching raw data')
        console.error(response);
    }
}
export const fetchTests = async (setstate,handleSnackbarOpen) => {
    try {
        const response = await api.get("/Tests");
        if (response.data) {
            setstate(
                response.data.map((opt) => {
                    opt.label = `${opt.testcode} - ${opt.testshtdesc}`;
                    return opt;
                })
            );
        }
    } catch ({response}) {
        handleSnackbarOpen('error','An error occured while fetching tests')
        console.error(response);
    }
}
export const createStep = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.post("/Step", body);
        if (response.status === 201) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Step created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateStep = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.put(`/Step/${body.stepCode}`, body);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Step updated succesfully!");
            navigate(-1)
        }
    }catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteStep = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/Step/${body.stepCode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Step deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.stepCode,
        row.stepDesc,
        (row.status === 'Y' ? "YES" : "NO"),
        row.comments,
        row.stepCateCode,
        row.createdBy,
        DateTime.fromISO(row.createdOn).toLocaleString(DateTime.DATE_SHORT),
        row.lastUser,
        DateTime.fromISO(row.lastUpdate).toLocaleString(DateTime.DATE_SHORT),
    ])
    if (selectedRows.length > 0) {
        exportPDF(head, body)
    }

}
export const exportWithcategory = (columns, data) => {
    const doc = new jsPDF("landscape");
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const tableData = data[key];
            const head = ['Step Category Code', 'Step Code', 'Description', 'Created By', 'Created On', 'Last User', 'Last Updated']
            const rows = tableData.map((row) => [
                row.stepCateCode,
                row.stepCode,
                row.stepDesc,
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
}
export const GenerateColumns = (handleDeleteClick, handleEditClick) => (
    [
        { field: 'stepCode', headerName: 'Code', flex: 1 },
        { field: 'stepDesc', headerName: 'Description', flex: 1 },
        {
            field: 'status', headerName: 'Status', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO")
        },
        { field: 'comments', headerName: 'Comments', flex: 1 },
        { field: 'stepCateCode', headerName: 'Step Category', flex: 1 },
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
export const initStep = {
    stepCode: "",
    stepCateCode: "",
    stepDesc: "",
    stepDetailsRTF: "",
    stepDetailsHTML: "",
    canSavePartially: "",
    isReadReqd: "",
    isCalcReqd: "",
    isValidReqd: "",
    comments: "",
    noteRTF: "",
    noteHTML: "",
    status: "",
    subDepCode: "",
    stepCateDesc: "",
    rawData: [],
    tests: [],
    validations: [],
    tenantId: "1038",
};
export const initRawData = {
    seqNo: "",
    testDataCode: "",
    testDataDesc: "",
    noOfReading: "",
    behaviour: "",
    unit: "",
    assignment: "",
    valueType: "",
    multipleUnit: "",
    comments: "",
};
export const initTest = {
    seqNo: "",
    testcode: "",
    testshtdesc: "",
    noOfTimes: "",
    behaviour: "",
    unit: "",
    comments: "",
};
export const initValidation = {
    validRuleNo: "",
    formula: "",
    operator: "",
    resultValue1: "",
    resultValue2: "",
};
export const initialErrors = {
    CodeError: "",
    descError: "",
    commError: "",
    catError: "",
    detailError: "",
}
export const tableHeaderRawData = [
    { id: "seqNo", label: "Seq No", field: "seqNo" },
    { id: "testDataCode", label: "Test Data Code", field: "testDataCode" },
    { id: "testDataDesc", label: "Test Data Desc", field: "testDataDesc" },
    { id: "noOfReading", label: "No Of Reading", field: "noOfReading" },
    { id: "behaviour", label: "Behaviour", field: "behaviour" },
    { id: "unit", label: "Unit", field: "unit" },
    { id: "assignment", label: "Assignment", field: "assignment" },
    { id: "valueType", label: "Value Type", field: "valueType" },
    { id: "multipleUnit", label: "Multiple Unit", field: "multipleUnit" },
    { id: "comments", label: "Comments", field: "comments" },
];
export const tableHeaderTest = [
    { id: "seqNo", label: "Seq No", field: "seqNo" },
    { id: "testcode", label: "Test Code", field: "testcode" },
    { id: "testshtdesc", label: "Test Sht Desc", field: "testshtdesc" },
    { id: "noOfTimes", label: "No Of Times", field: "noOfTimes" },
    { id: "behaviour", label: "Behaviour", field: "behaviour" },
    { id: "unit", label: "Unit", field: "unit" },
    { id: "comments", label: "Comments", field: "comments" },
];
export const tableHeaderValidation = [
    { id: "validRuleNo", label: "Valid RuleNo", field: "validRuleNo" },
    { id: "formula", label: "Formula", field: "formula" },
    { id: "operator", label: "Operator", field: "operator" },
    { id: "resultValue1", label: "Value 1", field: "resultValue1" },
    { id: "resultValue2", label: "Value 2", field: "resultValue2" },
];
export const doesIdExist = (arr, obj, arrName) => {
    return arr[arrName].some((item) => item.seqNo === obj.seqNo);
}
export const doesIdExistInValidations = (arr, obj) => {
    return arr.validations.some((item) => item.validRuleNo === obj.validRuleNo);
}
export { fetchData };  