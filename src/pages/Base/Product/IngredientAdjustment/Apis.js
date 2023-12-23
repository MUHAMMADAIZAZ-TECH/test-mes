import { DateTime } from 'luxon';
import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";
import api from '../../../../api/api';

export const getOptions = async ({ sectioncode, productCode, TempCode, stageCode }, setIngAdjsArr, handleSnackbarOpen) => {
    try {
        const response = await api.get(
            `/IngredientAdjustment/${sectioncode}/${productCode}/${TempCode}/${stageCode}`
        );
        if (response.data) {
            setIngAdjsArr(response.data);
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching data')
        console.error(response);
    }
};

export const fetchTest = async (setTests, handleSnackbarOpen) => {
    try {
        const response = await api.get("/Tests");
        if (response.data) {
            setTests(response.data);
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching tests')
        console.error(response);
    }
};
export const fetchRawData = async (setRawData, handleSnackbarOpen) => {
    try {
        const response = await api.get("/RawData");
        if (response.data) {
            setRawData(response.data);
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching raw data')
        console.error(response);
    }
};
export const fetchMasterFormula = async (
    { sectioncode, productCode, TempCode, stageCode },
    setMasterFormula,
    setIsDataAvailable,
    handleSnackbarOpen,
    EditMode
) => {
    try {
        const response = await api.get(
            `/IngredientAdjustment/${sectioncode}/${productCode}/${TempCode}/${stageCode}`
        );
        if (response.status === 200) {
            setMasterFormula(response.data);
            setIsDataAvailable(true);
        }
    } catch ({ response }) {
        (response.status === 404 && !EditMode ? setIsDataAvailable(true) : (
            handleSnackbarOpen('error', 'An error occured while fetching master formula')
        ))
        console.error(response);
    }
};
export const deleteIngrAdjs = async ({ sectioncode, productCode, TempCode, stageCode, ingredientAdjs }, handleSnackbarOpen, setloading) => {
    setloading(true)
    try {
        const res = await api.delete(
            `/IngredientAdjustment/${sectioncode}/${productCode}/${TempCode}/${stageCode}/${ingredientAdjs.adjOptCode}`
        );
        if (res.status === 204) {
            setloading(false)
            handleSnackbarOpen("success", "Deleted successfully!");
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', 'An error occured while deleting')
        console.error(response);
    }
};
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
export const initialState = {
    "prodcode": "",
    "prodshtname": "",
    "prodlngname": "",
    "prodcatecode": "",
    "prodcatedesc": "",
    "registrationno": "",
    "batchsize": "",
    "status": "",
    "storagecon": "",
    "unit": "",
    "lastuser": "",
    "lastupdate": "",
    "createdby": "",
    "createdon": "",
    "description": "",
    "controlSubstance": "",
    "controlSubDesc": "",
    "prodComments": "",
    "partialPh": "",
    "uoPE": "",
    "section": {
        "id": "",
        "sectionCode": "",
        "sectionDesc": "",
        "createdBy": "",
        "createdOn": "",
        "lastUser": "",
        "lastUpdate": "",
        "tenantId": "1038",
        "sectionpk": "",
        "_etag": "",
        "isdeleted": false,
        "clientInfoReqd": "",
        "expiryDateReqd": "",
        "applicableForProduct": ""
    },
    "customerCode": "",
    "customerDesc": "",
    "expiryMonth": "",
    "tenantId": "",
    "productpk": "",
    "_etag": "",
    "isdeleted": false
}