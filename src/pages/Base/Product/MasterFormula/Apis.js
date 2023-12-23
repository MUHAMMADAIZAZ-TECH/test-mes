import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchProducts = async (setProductCode,handleSnackbarOpen) => {
    try {
      const response = await api.get("/product");
      setProductCode(response.data);
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching products");
      console.error(response);
    }
  };
  export const fetchTemplates = async (setstate,handleSnackbarOpen) => {
    try {
      const response = await api.get("/Template");
      setstate(response.data);
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching templates");
      console.error(response);
    }
  };
  export const fetchStages = async (setstate,handleSnackbarOpen) => {
    try {
      const response = await api.get("/product");
      setstate(response.data);
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching stage");
      console.error(response);
    }
  };
export const fetchSections = async (setSectionCode,handleSnackbarOpen) => {
    try {
      const response = await api.get("/section");
      if (response.data) {
        const data = response.data.filter(
          (opt) => opt.applicableForProduct === "N"
        );
        setSectionCode(data);
      }
    } catch ({ response }) {
      handleSnackbarOpen("error", "An error occured while fetching sections");
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
export const GenerateColumns = (handleDeleteClick, handleEditClick) => (
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
