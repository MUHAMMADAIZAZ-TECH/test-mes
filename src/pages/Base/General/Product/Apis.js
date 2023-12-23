import api from "../../../../api/api";
import { DateTime } from "luxon";
import { Edit, Delete } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { exportPDF ,fetchData} from "../../../../utils/functions";
import { ERROR_MESSAGES } from "../../../../utils/constants";

export const fetchClients = async (setClients,handleSnackbarOpen) => {
  try {
      const response = await api.get(`/customer`);
      if (response.status === 200) {
          setClients(response.data)
      }
  }catch ({ response }) {
    handleSnackbarOpen("error", 'An error occured while fetching customers');
    console.error(response);
}
}
export const fetchProductCategories = async (setstate,handleSnackbarOpen) => {
  try {
      const response = await api.get(`/productCategory`);
      if (response.status === 200) {
        setstate(response.data)
      }
  } catch ({ response }) {
    handleSnackbarOpen("error", "An error occured while fetching product category");
    console.error(response);
}
}
export const fetchSections = async (setstate,handleSnackbarOpen) => {
  try {
      const response = await api.get(`/section`);
      if (response.status === 200) {
        setstate(response.data)
      }
  } catch ({ response }) {
    handleSnackbarOpen("error", 'An error occured while fetching sections');
    console.error(response);
}
}
export const createProduct = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
  setConfig({ loading: true, error: null })
  try {
    const response = await api.post("/Product", body);
    if (response.status === 201) {
      setConfig({ loading: false, error: null })
      handleSnackbarOpen("success", "Product created succesfully!");
      navigate(-1)
    }
  } catch ({ response }) {
    setConfig({ loading: false, error: response })
    handleSnackbarOpen("error", ERROR_MESSAGES.createError);
    console.error(response);
}
};
export const updateProduct = async ({ body, handleSnackbarOpen, navigate },setConfig) => {
  setConfig({ loading: true, error: null })
  try {
    const response = await api.put(`/Product/${body.prodcode}`, body);
    if (response.status === 200) {
      setConfig({ loading: false, error: null })
      handleSnackbarOpen("success", "Product updated succesfully!");
      navigate(-1)
    }
  } catch ({ response }) {
    setConfig({ loading: false, error: response })
    handleSnackbarOpen("error", ERROR_MESSAGES.updateError);
    console.error(response);
}
};
export const deleteProduct = async ({
  body,
  fetchFunction,
  handleSnackbarOpen,
}) => {
  try {
    const response = await api.delete(`/Product/${body.prodcode}`);
    if (response.status === 204) {
      fetchFunction();
      handleSnackbarOpen("success", "Product deleted succesfully!");
    }
  } catch ({ response }) {
    handleSnackbarOpen("error", ERROR_MESSAGES.deleteError);
    console.error(response);
}
};
export const exportToPDF = (columns, selectedRows) => {
  const head = [
    columns.map((item) => item.headerName).slice(0, columns.length - 1),
  ];
  const body = selectedRows.map((row) => [
    row.prodcode,
    row.prodshtname,
    row.prodcatecode,
    row.prodcatedesc,
    row.createdBy,
    DateTime.fromISO(row.createdOn).toLocaleString(DateTime.DATE_SHORT),
    row.lastuser,
    DateTime.fromISO(row.lastUpdate).toLocaleString(DateTime.DATE_SHORT),
  ]);
  if (selectedRows.length > 0) {
    exportPDF(head, body);
  }
};
export const GenerateColumns = (handleDeleteClick, handleEditClick) => [
  { field: "prodcode", headerName: "Code", flex: 1 },
  { field: "prodshtname", headerName: "Description", flex: 1 },
  { field: "prodcatecode", headerName: "Category", flex: 1 },
  { field: "prodcatedesc", headerName: "Description", flex: 1 },
  { field: "createdBy", headerName: "Created By", flex: 1 },
  {
    field: "createdOn",
    headerName: "Created On",
    flex: 1,
    type: "date",
    valueFormatter: (params) => {
      const date = DateTime.fromISO(params.value);
      return date.toLocaleString(DateTime.DATE_SHORT); // Customize the format
    },
  },
  { field: "lastUser", headerName: "Last User", flex: 1 },
  {
    field: "lastUpdate",
    headerName: "Last Updated",
    flex: 1,
    type: "date",
    valueFormatter: (params) => {
      const date = DateTime.fromISO(params.value);
      return date.toLocaleString(DateTime.DATE_SHORT); // Customize the format
    },
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
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
];

export const fetchProdDoc = async (product, setDocuments) => {
  try {
    const res = await api.get(`ProductDocument/Products/${product}`);
    if (res.data) {
      setDocuments(res.data);
    }
  } catch (error) {
    setDocuments([]);
    console.error(error);
  }
};
const createProdDoc = async (document, setDocuments,handleSnackbarOpen) => {
  try {
    const res = await api.post(`/ProductDocument`, document);
    if (res.status === 201) {
      handleSnackbarOpen("success", "Product document uplaoded succesfully!");
      fetchProdDoc(document.productCode, setDocuments);
    }
  } catch (error) {
    console.error(error);
  }
};

export const uploadFile = async (
  file,
  document,
  setDocuments,
  handleSnackbarOpen
) => {
  try {
    const res = await api.post(
      `ProductDocument/${document.productCode}/Upload`,
      file
    );
    if (res.data) {
      document.fileName = res.data.fileName;
      createProdDoc(document, setDocuments, handleSnackbarOpen);
    }
  } catch (error) {
    console.error(error);
  }
};

export const downloadFile = async (row) => {
  try {
    const response = await api.get(
      `/ProductDocument/${row.documentId}/Download`,
      {
        headers: {
          "Content-Type": "application/octet-stream",
        },
        responseType: "blob",
      }
    );

    if (response.status === 200) {
      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", row.documentId);

      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);
    } else {
      console.error(
        "Error in the axios.get request:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteProdDoc = async (row, setDocuments, handleSnackbarOpen) => {
  try {
    const res = await api.delete(`/ProductDocument/${row.documentId}`);
    if (res.status === 204) {
      fetchProdDoc(row.productCode, setDocuments);
      handleSnackbarOpen("success", "Product document deleted succesfully!");
    }
  } catch (error) {
    console.error(error);
  }
};

export const initProduct = {
  prodcode: "",
  prodshtname: "",
  prodlngname: "",
  description: "",
  prodcatecode: "",
  storagecon: "",
  registrationno: "",
  unit: "",
  prodComments: "",
  section: {},
  batchsize: "",
  status: "N",
  controlSubstance: "N",
  controlSubDesc: "",
  partialPh: "N",
  uoPE: "N",
  template: "",
  tenantId: "1038",
  prodcatedesc: "",
};
export const initialErrors = {
  CodeError: "",
  nameError: "",
  addressError: "",
  PhoneError: "",
};

export { fetchData }