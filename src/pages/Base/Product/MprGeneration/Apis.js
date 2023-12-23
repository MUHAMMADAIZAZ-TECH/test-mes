import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

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
        handleSnackbarOpen('error', 'An error occured while fetching Template')
        console.error(response);
    }
}

const onSubmit = async (setloading, selectedData, setMpr, setIsDataAvailable, handleSnackbarOpen) => {
    const { sectionCode, prodCode, tempCode, EditMode } = selectedData;
    if (sectionCode && prodCode && tempCode) {
        setloading(true)
        try {
            const res = await api.get(`/ProductMPR/${sectionCode}/${prodCode}/${tempCode}`);
            if (res.status === 200) {
                setMpr(res.data);
                setIsDataAvailable(true)
                setloading(false)
            }
        } catch (error) {
            if (error.response.status !== 404 && !EditMode) {
                handleSnackbarOpen('error', 'An error occured while fetching product MPR')
            }
            setMpr(null);
            setIsDataAvailable(true)
            setloading(false)
            console.log(error.response.status);
        }
    }
    else {
        handleSnackbarOpen("error", "Empty required fields");
    }

};
const generateMpr = async (setloading, state, handleSnackbarOpen) => {
    console.log(setloading);
    setloading(true)
    try {
        const res = await api.post(`/ProductMPR`, state);
        if (res.status === 201) {
            setloading(false)
            handleSnackbarOpen("success", "MPR generated successfully");
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', 'An error occured while genrating MPR')
        console.error(response);
    }
};

const regenerateMpr = async (setloading, selectedData, handleSnackbarOpen) => {
    setloading(true);
   const { sectionCode, prodcode, tempCode } = selectedData
    try {
        const res = await api.delete( `/ProductMPR/${sectionCode}/${prodcode}/${tempCode}`);
        if (res.status === 204) {
            setloading(false)
            generateMpr(setloading, selectedData, handleSnackbarOpen);
            handleSnackbarOpen('success', 'Product MPR Regenerated successfully')
        }
    } catch ({ response }) {
        setloading(false)
        handleSnackbarOpen('error', 'An error occured while deleting')
        console.error(response);
    }
};
export { fetchProducts, fetchTemplates, onSubmit, regenerateMpr, generateMpr };
export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.prodcode,
        row.prodDesc,
        row.sectionCode,
        row.tempCode,
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
        { field: 'prodcode', headerName: 'Product Code', flex: 1 },
        { field: 'prodDesc', headerName: 'Product Description', flex: 1 },
        { field: 'sectionCode', headerName: 'Section Code', flex: 1 },
        { field: 'tempCode', headerName: 'Template Code', flex: 1 },
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
