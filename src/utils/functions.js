import * as XLSX from "xlsx"; // Import XLSX library
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from '../api/api'
// import { ERROR_MESSAGES } from "./constants";

export const exportPDF = (head, body) => {
    const doc = new jsPDF("landscape");
    doc.autoTable({ head, body });
    doc.save(`document.pdf`);
};
export const exportPDFOnnewtab = (head, body) => {
    const doc = new jsPDF("landscape");
    doc.autoTable({ head, body });
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
};
export const exportExcel = (selectedRows) => {
    if (selectedRows.length === 0) {
        return;
    }
    const fileName = window.prompt("Enter a file name for the Excel", "Area code");
    if (!fileName) {
        return;
    }
    const selectedData = selectedRows.map((row) => ({
        AreaCode: row.areaCode,
        AreaDescription: row.areaDesc,
        AreaTypeCode: row.areaTypeCode,
    }));
    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SelectedRows");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
export const groupRows = (rows, code) => {
    const groupedRows = {};
    rows.forEach((row) => {
        const Type = row[code];
        if (!groupedRows[Type]) {
            groupedRows[Type] = [];
        }
        groupedRows[Type].push(row);
    });
    return groupedRows;
};

export const handlePrint = (printContent) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 1000); // Delay of 1 second (adjust the delay as needed)
};
export const handlePrintByClass = () => {
    let printContents = document.getElementById('printproduct').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
}
export const fetchAllData = async (Page, ItemsPerPage, setstate, handleSnackbarOpen, url) => {
    setstate((prev) => ({ ...prev, isLoading: true }));
    try {
        const response = await api.get(`/${url}?Page=${Page + 1}&ItemsPerPage=${ItemsPerPage}`);
        if (response.status === 200) {
            const paginationHeader = response.headers['x-pagination'];

            if (paginationHeader) {
                const paginationParams = JSON.parse(paginationHeader);
                setstate((prev) => ({
                    ...prev,
                    rows: response.data || [],
                    totalRows: paginationParams.TotalCount,
                    isLoading: false,
                    error: null
                }));
            } else {
                setstate((prev) => ({
                    ...prev,
                    rows: response.data || [],
                    totalRows: null,
                    isLoading: false,
                    error: null
                }));
            }
        }
    } catch ({ response }) {
        setstate((prev) => ({ ...prev, isLoading: false, rows: [], error: response }));
        console.error(response);
        // if (response?.status !== 404) {
        //     handleSnackbarOpen("error", ERROR_MESSAGES.fetchError);
        // }
    }
}

export const fetchData = async (code, setstate, setConfig, handleSnackbarOpen, url) => {
    setConfig({ loading: true, error: null })
    try {
        const response = await api.get(`/${url}/${code}`);
        if (response.status === 200) {
            setConfig({ loading: false, error: null })
            setstate(response.data)
        }
    } catch ({ response }) {
        setConfig({ loading: false, error: response })
        console.error(response);
        // if (response?.status !== 404) {
        //     handleSnackbarOpen("error", ERROR_MESSAGES.fetchError);
        // }
    }
}

export const transformData = (originalData) => {
    if (originalData) {
        const transformedData = {
            ...originalData,
            stages: originalData.stage.map(stage => ({
                stageCode: stage.stageCode,
                stgLevelNo: stage.stgLevelNo,
                stageDesc: stage.stageDesc,
                unitOperations: originalData.unitOperation.filter(unit => unit.stgLevelNo === stage.stgLevelNo).map(unit => ({
                    stgLevelNo: unit.stgLevelNo,
                    uoLevelNo: unit.uoLevelNo,
                    mpUnitCode: unit.mpUnitCode,
                    mpUnitDesc: unit.mpUnitDesc,
                    steps: originalData.step.filter(step => step.uoLevelNo === unit.uoLevelNo && step.stgLevelNo === unit.stgLevelNo),
                })),
            })),
        };
        return transformedData
        //   setTransformedData(transformedData);
    }
};