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
        handleSnackbarOpen('error', 'An error occured while fetching template')
        console.error(response);
    }
}
async function fetchSteps(id, setSteps, handleSnackbarOpen) {
    try {
        const res = await api.get(`Template/${id}`);
        if (res.data) {
            setSteps(
                res.data.step.map((opt) => {
                    opt.label = `${opt.stepCode} - ${opt.stepDesc}`;
                    return opt;
                })
            );
        }
    } catch ({ response }) {
        handleSnackbarOpen('error', 'An error occured while fetching steps')
        console.error(response);
    }
}

async function fetchStep(
    state,
    selectedData,
    setSelectedData,
    setIsDataAvailable,
    handleSnackbarOpen,
    setStep,
    EditMode
    ) {
    const { stepCode } = state;
    try {
        const res = await api.get(`Step/${stepCode}`);
        if (res.data) {
            setSelectedData((prev) => ({
                ...prev,
                step: res.data,
            }));
            fetchStepVal(selectedData, res.data, state, setStep, setIsDataAvailable,EditMode,handleSnackbarOpen);
        }
    }
    catch ({ response }) {
        setIsDataAvailable(false);
        handleSnackbarOpen('error', 'An error occured while fetching step')
        console.error(response);
    }
}
async function fetchStepVal(selectedData, step, state, setStep, setIsDataAvailable,EditMode,handleSnackbarOpen) {
    const { prodCode, tempCode, stepCode, sectionCode } = state
    try {
        const res = await api.get(
            `ProductLevelStepValidation/Section/${sectionCode}/Product/${prodCode}/${tempCode}/Steps/${stepCode}`
        );
        if (res.data) {
            if (res.data.lstProductLevelStepValidations.length > 0) {
                setStep(res.data);
                setIsDataAvailable(true);
            } else {
                setStep({
                    ...step,
                    lstProductLevelStepValidations: selectedData.step?.validations,
                });
                setIsDataAvailable(true);
            }
        }
    } catch (error) {
        if (error.response.status === 404 && !EditMode) {
            setIsDataAvailable(true);
            setStep({
                tenantId: "1038",
                productCode: prodCode,
                sectionCode: sectionCode,
                tempCode: tempCode,
                stepCode: stepCode,
                lstProductLevelStepValidations: step?.validations,
            });
        }
        else {
            handleSnackbarOpen('error', 'An error occured while fetching Product Step Validation')
        }
        console.error(error);
    }
}

export const deleteStepVal = async (selectedData, handleSnackbarOpen, onClose) => {
    try {
        const response = await api.delete(
            `ProductLevelStepValidation/Section/${selectedData.product.section.sectionCode}/Product/${selectedData.product.prodcode}/${selectedData.template.templateCode}/Steps/${selectedData.step.stepCode}`
        );
        if (response.status === 204) {
            handleSnackbarOpen("success", "Deleted succesfully!");
            onClose();
        }
    } catch (error) {
        handleSnackbarOpen("error", "An error occured while deleting");
        console.error(error);
    }
};
export const deleteStepValInList = async ({ body, fetchFunction, handleSnackbarOpen }) => {
    try {
        const response = await api.delete(
            `ProductLevelStepValidation/Section/${body.sectionCode}/Product/${body.productCode}/${body.tempCode}/Steps/${body.stepCode}`)
        if (response.status === 204) {
            fetchFunction()
            handleSnackbarOpen("success", "Deleted succesfully!");
        }
    } catch ({ response }) {
        handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
        console.error(response);
    }
}
export const createStepVal = async (setloading, selectedData, step, handleSnackbarOpen, onClose) => {
    setloading(true)
    try {
        const response = await api.post(
            `ProductLevelStepValidation/Section/${selectedData.product.section.sectionCode}/Product/${selectedData.product.prodcode}/${selectedData.template.templateCode}/Steps/${selectedData.step.stepCode}`,
            step
        );
        if (response.status === 201) {
            setloading(false)
            handleSnackbarOpen("success", "Created succesfully!");
            onClose();
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen("error", "An error occured while creating");
        console.error(response);
    }
};
export const updateStepVal = async (setloading, selectedData, step, handleSnackbarOpen, onClose) => {
    setloading(true)
    try {
        const response = await api.put(
            `ProductLevelStepValidation/Section/${selectedData.product.section.sectionCode}/Product/${selectedData.product.prodcode}/${selectedData.template.templateCode}/Steps/${selectedData.step.stepCode}`,
            step
        );
        if (response.status === 200) {
            setloading(false)
            handleSnackbarOpen("success", "Updated succesfully!");
            onClose();
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen("error", "An error occured while updating");
        console.error(response);
    }
};

export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.productCode,
        row.sectionCode,
        row.tempCode,
        row.stepCode,
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
        { field: 'productCode', headerName: 'Product Code', flex: 1 },
        { field: 'sectionCode', headerName: 'Section Code', flex: 1 },
        { field: 'tempCode', headerName: 'Template Code', flex: 1 },
        { field: 'stepCode', headerName: 'Step Code', flex: 1 },
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
export const initValidation = {
    validRuleNo: "",
    formula: "",
    operator: "=",
    resultValue1: "",
    resultValue2: "",
};
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
export { fetchProducts, fetchTemplates, fetchSteps, fetchStep, fetchStepVal }