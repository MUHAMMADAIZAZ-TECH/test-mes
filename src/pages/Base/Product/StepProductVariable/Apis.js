import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF, fetchData } from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

async function fetchProducts(setProducts, handleSnackbarOpen) {
    try {
        const res = await api.get("/Product");
        if (res.data) {
            setProducts(
                res.data.map((opt) => {
                    opt.label = `${opt.prodcode} - ${opt.prodshtname}`;
                    return opt;
                })
            );
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching products')
        console.error(response);
    }
}
async function fetchTemplates(id, setTemplates, handleSnackbarOpen) {
    try {
        const res = await api.get(`/Product/${id}/TempCode`);
        if (res.data) {
            setTemplates(
                res.data.map((opt) => {
                    opt.label = `${opt.templateCode}`;
                    return opt;
                })
            );
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching templates')
        console.error(response);
    }
}
async function fetchStepCtgs(id, setStepCtgs, handleSnackbarOpen) {
    try {
        const res = await api.get(`/Template/${id}/StepCategories`);
        if (res.data) {
            setStepCtgs(
                res.data.map((opt) => {
                    opt.label = `${opt.stepCateCode} - ${opt.stepCateDesc}`;
                    return opt;
                })
            );
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching step category')
        console.error(response);
    }
}
async function fetchProdVar(state, setProdVar, setIsDataAvailable) {
    const { prodCode, tempCode, stepCategory } = state;
    try {
        const res = await api.get(
            `/ProductVariable/Product/${prodCode}/TempCode/${tempCode}/${stepCategory}`
        );
        if (res.data) {
            setProdVar(res.data);
            setIsDataAvailable(true);
        }
    } catch (error) {
        setProdVar((prev) => ({
            ...prev,
            prodCode,
            tempCode,
            stepCategory,
            tenantId: "1038",
        }));
        fetchRawData(state,setProdVar,setIsDataAvailable);
        fetchVariables(state,setProdVar,setIsDataAvailable);
        console.error(error);
    }
}
async function fetchVariables(state, setProdVar, setIsDataAvailable) {
    try {
        const res = await api.get(
            `/Template/${state.tempCode}/StepCategories/${state.stepCategory}/Variables`
        );
        if (res.data) {
            setProdVar((prev) => ({
                ...prev,
                variables: res.data,
            }));
            setIsDataAvailable(true);
        }
    } catch (error) {
        setIsDataAvailable(false);
        console.error(error);
    }
}
async function fetchRawData(state, setProdVar, setIsDataAvailable) {
    try {
        const res = await api.get(
            `/Template/${state.tempCode}/StepCategories/${state.stepCategory}/RawData`
        );
        if (res.data) {
            setProdVar((prev) => ({
                ...prev,
                rawData: res.data,
            }));
            setIsDataAvailable(true);
        }
    } catch (error) {
        setIsDataAvailable(false);
        console.error(error);
    }
}

export const createProductVariable = async (prodVar, selectedData, setloading, handleSnackbarOpen, onClose) => {
    setloading(true)
    const { prodCode, tempCode, stepCategory } = selectedData;
    try {
        const response = await api.post(
            `/ProductVariable/Product/${prodCode}/TempCode/${tempCode}/${stepCategory}`,
            prodVar
        );
        if (response.status === 201) {
            setloading(false)
            handleSnackbarOpen("success", "Created succesfully!");
            onClose();
        }
    } catch (error) {
        setloading(false)
        handleSnackbarOpen('error', 'An error occured while creating')
        console.error(error);
    }
};
export const updateProductVariable = async (prodVar, selectedData, setloading, handleSnackbarOpen, onClose) => {
    setloading(true)
    const { prodCode, tempCode, stepCategory } = selectedData;
    try {
        const response = await api.put(
            `/ProductVariable/Product/${prodCode}/TempCode/${tempCode}/${stepCategory}`,
            prodVar
        );
        if (response.status === 200) {
            setloading(false)
            handleSnackbarOpen("success", "Updated succesfully!");
            onClose();
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', 'An error occured while updating')
        console.error(response);
    }
};
export const deleteProductVariable = async (selectedData, handleSnackbarOpen, onClose) => {
    const { prodCode, tempCode, stepCategory } = selectedData;
    try {
        const response = await api.delete(
            `/ProductVariable/Product/${prodCode}/TempCode/${tempCode}/${stepCategory}`
        );
        if (response.status === 204) {
            handleSnackbarOpen("success", "Deleted succesfully!");
            onClose();
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while deleting')
        console.error(response);
    }
};
export const deleteProVar = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete( `/ProductVariable/Product/${body.prodCode}/TempCode/${body.tempCode}/${body.stepCategory}`);
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.prodCode,
        row.tempCode,
        row.stepCategory,
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
        { field: 'prodCode', headerName: 'Code', flex: 1 },
        { field: 'tempCode', headerName: 'Template', flex: 1 },
        { field: 'stepCategory', headerName: 'Step Category', flex: 1 },
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

export const initialErrors = {
    area: "",
    description: "",
    areaTypeCode: "",
}
export const tableHeaderRawData = [
    { id: "stepCode", label: "Step Code", field: "stepCode" },
    { id: "stepDesc", label: "Description", field: "stepDesc" },
    { id: "testDataCode", label: "Raw Data Code", field: "testDataCode" },
    { id: "testDataDesc", label: "Description", field: "testDataDesc" },
    { id: "testDataValue", label: "Value", field: "testDataValue" },
];
export const tableHeaderVariable = [
    { id: "stepCode", label: "Step Code", field: "stepCode" },
    { id: "stepDesc", label: "Description", field: "stepDesc" },
    { id: "stepVar", label: "Variable", field: "stepVar" },
    { id: "varValue", label: "Value", field: "varValue" },
];
export {
    fetchData, fetchProducts,
    fetchTemplates, fetchStepCtgs, fetchProdVar,
    fetchVariables, fetchRawData
}