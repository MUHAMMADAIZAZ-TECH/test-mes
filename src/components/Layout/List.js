import React, { useState, useEffect } from "react";
import { CustomDataGrid } from "../index";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllData } from "../../utils/functions";

const List = ({
    code,
    generateColumns,
    url,
    HideAddButton,
    fetchFunction,
    exportToPDFFunction,
    deleteFunction,
    OtherAction,
    handleSnackbarOpen,
    handleAction,
    EditFunction,
    BtnText
}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [selectedRows, setselectedRow] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [state, setstate] = useState({ isLoading: false, rows: [], totalRows: 0, errors: null })
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

    const fetchDataFunction = url ? fetchAllData : fetchFunction;

    const handleClick = () => {
        navigate(`${pathname}/add`);
    };
    const handleEditClick = (row) => () => {
        EditFunction ? EditFunction(row) : navigate(`${pathname}/edit/${row[code]}`);
    };

    const handleDeleteClick = (body) => () => {
        OtherAction ? OtherAction(body) : handleAction("Are you sure you want to Delete", () =>
            deleteFunction({
                body, handleSnackbarOpen,
                fetchFunction: () => fetchDataFunction(
                    paginationModel?.page,
                    paginationModel?.pageSize,
                    setstate, handleSnackbarOpen,
                    url
                ),
            })
        );
    }
    const columns = generateColumns(handleDeleteClick, handleEditClick) || [];
    const exportPDF = () => {
        let Rows = selectedRows.length > 0 ? selectedRows : state.rows;
        exportToPDFFunction(columns, Rows)
    }
    useEffect(() => {
        fetchDataFunction(
            paginationModel?.page,
            paginationModel?.pageSize,
            setstate,
            handleSnackbarOpen,
            url);
    }, [paginationModel, url]);

    return (
        <CustomDataGrid
            onExportToPDF={exportPDF}
            handleClick={!HideAddButton && handleClick}
            rows={state.rows || []}
            columns={columns}
            checkboxSelection
            selectedRows={selectedRows}
            setselectedRow={setselectedRow}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
            paginationModel={paginationModel}
            rowCount={state.totalRows}
            loading={state.isLoading}
            onPaginationModelChange={setPaginationModel}
            BtnText={BtnText}
        />

    )
}

export default List
