import { DateTime } from 'luxon';
import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.prodcode,
        row.prodshtname,
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
        { field: 'prodcode', headerName: 'Code', flex: 1 },
        { field: 'prodshtname', headerName: 'Product', flex: 1 },
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