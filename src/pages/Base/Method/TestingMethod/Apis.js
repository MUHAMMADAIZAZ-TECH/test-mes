import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF,fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";
export const fetchRawData = async (setRawData, rawDataInput, handleSnackbarOpen) => {
    try {
        if (rawDataInput) {
            const response = await api.get(`/RawData/${rawDataInput}`);
            if (response.status === 200) {
                setRawData([response.data]);
            }
        } else {
            const response = await api.get("/RawData");
            setRawData(response.data);
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", "An error occured while fetching raw data");
        console.error(response);
    }
}

export const fetchTests = async (setTests, testInput, handleSnackbarOpen) => {
    try {
        if (testInput) {
            const response = await api.get(`/Tests/${testInput}`);
            if (response.status === 200) {
                setTests([response.data]);
            }
        } else {
            const response = await api.get("/Tests");
            setTests(response.data);
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", "An error occured while fetching tests");
        console.error(response);
    }
}

export const createMethod = async ({ body, handleSnackbarOpen, navigate }, setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.post("/TestingMethod", body);
        if (response.status === 201) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Testing method created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateMethod = async ({ body, handleSnackbarOpen, navigate }, setConfig) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.put(`/TestingMethod/${body.methodID}`, body);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            handleSnackbarOpen("success", "Testing method succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteMethod = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/TestingMethod/${body.methodID}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Testing method succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.methodID,
        row.methodDesc,
        (row.numerical === 'Y' ? "YES" : "NO"),
        (row.formulaBase === 'Y' ? "YES" : "NO"),
        row.formula,
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
        { field: 'methodID', headerName: 'Code', flex: 1 },
        { field: 'methodDesc', headerName: 'Description', flex: 1 },
        {
            field: 'numerical', headerName: 'Numerical', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO"),
            type: "singleSelect",
            valueOptions: [{ value: "Y", label: "YES" }, { value: "N", label: "NO" }]
        },
        {
            field: 'formulaBase', headerName: 'Formula base', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO"),
            type: "singleSelect",
            valueOptions: [{ value: "Y", label: "YES" }, { value: "N", label: "NO" }]
        },
        { field: 'formula', headerName: 'Formula', flex: 1 },
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
export const initMethod = {
    methodID: "",
    methodDesc: "",
    numerical: "",
    formulaBase: "",
    formula: "",
    frmDesc: "",
    refNo: "",
    userField1: "",
    userField2: "",
    userField3: "",
    multicalc: "",
    operOfTest: "",
    operation: "",
    status: "",
    valueType: "",
    tenantId: "1038",
};
export const initialErrors = {
    CodeError: "",
    descError: "",
    forBaseError: "",
    formulaError: "",
}
export const methodTypes = [
    {
        value: "numeric",
        label: "Numeric",
    },
    {
        value: "dateTime",
        label: "Date Time",
    },
    {
        value: "hoursMinutesSeconds",
        label: "Hours Minutes Seconds",
    },
    {
        value: "noCalculation",
        label: "No calculation (For Sets)",
    },
    {
        value: "alphanumeric",
        label: "Alphanumeric (Non Numeric)",
    },
];

export const tableHeaderRawData = [
    { id: "testDataCode", label: "ID", field: "testDataCode" },
    { id: "testDataDesc", label: "Description", field: "testDataDesc" },
];

export const tableHeaderTests = [
    { id: "testcode", label: "ID", field: "testcode" },
    { id: "testlngdesc", label: "Description", field: "testlngdesc" },
];

export const buttons = ["+", "-", "*", "^", "(", ")", ",", "SUM", "SQR", "LOG", "EXP", "ABS", "COS", "SIN", "TAN"];
export { fetchData };