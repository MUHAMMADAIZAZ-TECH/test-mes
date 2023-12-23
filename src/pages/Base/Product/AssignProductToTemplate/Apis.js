import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Delete, Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";
export const fetchProducts = async (setstate, handleSnackbarOpen) => {
    try {
        const response = await api.get("/Product");
        if (response.status === 200) {
            const data = response.data.map((item) => ({
                prodcode: item.prodcode,
                productDesc: item.prodshtname,
                sectionCode: item.section.sectionCode,
                sectionDesc: item.section.sectionDesc,
            }));
            setstate(data);
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching products')
        console.error(response);
    }
}
export const fetchTemplates = async (setstate, handleSnackbarOpen) => {
    try {
        const response = await api.get("/Template");
        if (response.status === 200) {
            setstate(response.data);
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching templates')
        console.error(response);
    }
}
export const fetchProdTemplate = async (id, setstate, handleSnackbarOpen,EditMode) => {
    try {
        const response = await api.get(`/TempCode/${id}/AssignProductToTemplate`);
        if (response.status === 200) {
            setstate(response.data)
        }
    } catch ({ response }) {
        console.error(response);
        if (response.status === 404 && !EditMode) {
            setstate((prev) => ({ ...prev, lstProdTemplate: [] }))
        }
        else {
            handleSnackbarOpen('error', 'An error occured while fetching template')
        }

    }
}
export const updateProdTemplate = async ({ body, handleSnackbarOpen, navigate }, setloading) => {
    setloading(true)
    try {
        const response = await api.put(
            `/TempCode/${body.templateCode}/AssignProductToTemplate`,
            body
        );
        if (response.status === 200) {
            setloading(false)
            handleSnackbarOpen("success", "Template updated succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', ERROR_MESSAGES.updateError)
        console.error(response);
    }
}
export const AddProdTemplate = async ({ body, handleSnackbarOpen, navigate }, setloading) => {
    setloading(true)
    try {
        const response = await api.post(
            `/TempCode/${body.templateCode}/AssignProductToTemplate`,
            body
        );
        if (response.status === 201) {
            setloading(false)
            handleSnackbarOpen("success", "Template created succesfully!");
            navigate(-1)
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', ERROR_MESSAGES.updateError)
        console.error(response);
    }
}
export const deleteProdTemplate = async (id, handleSnackbarOpen, setloading) => {
    setloading(true)
    try {
        const response = await api.delete(
            `/TempCode/${id}/AssignProductToTemplate`,
        );
        if (response.status === 204) {
            setloading(false)
            handleSnackbarOpen("success", "Template deleted succesfully!");
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', ERROR_MESSAGES.deleteError)
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.templateCode,
        row.templateDesc,
        row.eSignStatus,
        row.type,
        row.createdBy,
        DateTime.fromISO(row.createdOn).toLocaleString(DateTime.DATE_SHORT),
        row.lastUser,
        DateTime.fromISO(row.lastUpdate).toLocaleString(DateTime.DATE_SHORT),
    ])
    if (selectedRows.length > 0) {
        exportPDF(head, body)
    }
}
export const GenerateColumns = (_, handleEditClick) => (
    [
        { field: 'templateCode', headerName: 'Code', flex: 1 },
        { field: 'templateDesc', headerName: 'Description', flex: 1 },
        { field: 'eSignStatus', headerName: 'ESign Status', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
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
                ];
            },
        },
    ]
)

export const initProdTemplate = {
    sectionCode: "",
    sectionDesc: "",
    productCode: "",
    productDesc: "",
    status: "N",
    controlNo: "",
    changeBatchSizeOnExe: "N",
    batchUnit: "",
    batchSize: "",
};

export const initialErrors = {
    temCodeError: "",
    proCodeError: "",
    batchSizeError: "",
    unitError: "",
    contNoError: "",
    statusError: "",
    secCodeError: "",
}

export const validate = (prodTemplate, errors) => {
    const newErrors = {
        ...errors,
        secCodeError: prodTemplate.sectionCode === "" ? "Section code is required" : "",
        proCodeError: prodTemplate.productCode === "" ? "Product code is required" : "",
        batchSizeError: prodTemplate.batchSize === "" ? "Batch size is required" : "",
        unitError: prodTemplate.batchUnit === "" ? "Unit is required" : "",
        contNoError: prodTemplate.controlNo === "" ? "Control no is required" : "",
        statusError: prodTemplate.status === "" ? "status is required" : "",
    };
    return newErrors
}
export const tableHeaderProdTemplate = [
    { id: "sectionCode", label: "Section", field: "sectionCode" },
    { id: "sectionDesc", label: "Description", field: "sectionDesc" },
    { id: "productCode", label: "Product", field: "productCode" },
    { id: "productDesc", label: "Description", field: "productDesc" },
    { id: "status", label: "Status", field: "status" },
    { id: "controlNo", label: "Control No", field: "controlNo" },
    { id: "batchSize", label: "Batch Size", field: "batchSize" },
    {
        id: "changeBatchSizeOnExe",
        label: "Change Batch Size at Initiation",
        field: "changeBatchSizeOnExe",
    },
    { id: "batchUnit", label: "Unit", field: "batchUnit" },
];