import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF, fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const fetchTestCatgs = async (setTestCatgs, handleSnackbarOpen) => {
    try {
        const response = await api.get("/TestCategory");
        if (response.data) {
            const data = response.data.map((item) => ({
                testCate: item.testCateCode,
                cateDesc: item.testCateDesc,
            }));
            setTestCatgs(data);
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", "An error occured while fetching test category");
        console.error(response);
    }
}
export const fetchMethodsAll = async (handleSnackbarOpen) => {
    try {
        const response = await api.get("/TestingMethod");
        return response.data;
    } catch ({ response }) {
        handleSnackbarOpen("error", "An error occured while fetching test methods");
        console.error(response);
    }
}
export const fetchMethods = async (setMethods, handleSnackbarOpen) => {
    try {
        const response = await api.get("/TestingMethod");
        setMethods(response.data);
    } catch ({ response }) {
        handleSnackbarOpen("error", "An error occured while fetching test methods");
        console.error(response);
    }
}
export const createTest = async ({ body, handleSnackbarOpen, navigate }) => {
    try {
        const response = await api.post("/Tests", body);
        if (response.status === 201) {
            handleSnackbarOpen("success", "Test created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.createError);
        console.error(response);
    }
}
export const updateTest = async ({ body, handleSnackbarOpen, navigate }) => {
    try {
        const response = await api.put(`/Tests/${body.testcode}`, body);
        if (response.status === 200) {
            handleSnackbarOpen("success", "Test updated succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
        console.error(response);
    }
}
export const deleteTest = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(`/Tests/${body.testcode}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Test deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.testcode,
        row.testshtdesc,
        (row.numltest === 'Y' ? "YES" : "NO"),
        (row.defectiveAnalysis === 'Y' ? "YES" : "NO"),
        row.testCate,
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
        { field: 'testcode', headerName: 'Code', flex: 1 },
        { field: 'testshtdesc', headerName: 'Description', flex: 1 },
        {
            field: 'numltest', headerName: 'Numerical', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO")
        },
        {
            field: 'defectiveAnalysis', headerName: 'Analysis', flex: 1,
            valueFormatter: (params) => (params.value === 'Y' ? "YES" : "NO")
        },
        { field: 'testCate', headerName: 'Test Category', flex: 1 },
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
export const initTest = {
    testcode: "",
    testshtdesc: "",
    testlngdesc: "",
    numltest: "",
    defectiveAnalysis: "",
    testCate: "",
    cateDesc: "",
    methods: [],
    tenantId: "1038",
};
export const initialErrors = {
    CodeError: "",
    sdescError: "",
    ldescError: "",
    catError: ""
}
export const tableHeader = [
    { id: "testcode", label: "ID", field: "testcode" },
    { id: "testlngdesc", label: "Description", field: "testlngdesc" },
];

export const tableHeaderMethods = [
    { id: "methodID", label: "ID", field: "methodID" },
    { id: "methodDesc", label: "Description", field: "methodDesc" },
];
export const methodTypes = [
    {
        value: "numeric",
        label: "Numeric",
    },
    {
        value: "DateTime",
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
export { fetchData };