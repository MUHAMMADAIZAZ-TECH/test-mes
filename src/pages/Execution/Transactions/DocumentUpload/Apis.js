import api from "../../../../api/api";
import { DateTime } from 'luxon';
import { Edit, Event } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { exportPDF } from "../../../../utils/functions";

export const fetchDocuments = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/DocUploadUnitOp/${state.sectionCode}/${state.prodcode}/${state.batchNo}`);
        setLoading({ loading: false, Found: true })
        setState((prev) => ({ ...prev, RequestBody: response.data || { ...prev.RequestBody } }))
    } catch ({ response }) {
        setLoading({ loading: false, Found: false })
        console.error(response);
    }
}
export const UpdateDocumentData = async (state) => {
    try {
        const response = await api.put(`/DocUploadUnitOp`, state);
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const AddDocumentData = async (state) => {
    try {
        const response = await api.post(`/DocUploadUnitOp`, state);
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const AddDocumentUpload = async ({
    documentOptions,
    docObject,
    state
}, setState, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(
            `/DocUploadUnitOp/Upload?sectionCode=${state.sectionCode}&productCode=${state.prodcode}&batchCode=${state.batchNo}`, formData);
        const FileObject = {
            "docTitle": response?.data?.originalFileName || "",
            "referenceNo": docObject.referenceNo || "",
            "docRelTo":
                documentOptions.batch ? 'B' : (
                    (documentOptions.step && 'STP') ||
                    (documentOptions.stage && documentOptions.unitOperation && 'U') ||
                    (documentOptions.stage && 'S') || ''),
            "comments": docObject.comments || "",
            "docID": response?.data?.documentId || "",
            "docDesc": docObject.docDesc || "",
            "docExt": response?.data?.fileType || "",
            "stgCode": documentOptions.batch ? "-" : state.stageCode || "",
            "uoCode": documentOptions.batch ? "-" : state.mpUnitCode || "",
            "stpCode": documentOptions.batch ? "-" : state.stepCode || ""
        }
        const UpdatedDocs = [...state.RequestBody.docs, FileObject]
        setState((prev) => ({
            ...prev,
            RequestBody: { ...prev.RequestBody, docs: UpdatedDocs }
        }))

    } catch ({ response }) {
        console.error(response);
    }
}


export const downloadFile = async (row) => {
    try {
      const response = await api.get(
        `/ProductDocument/${row.docID}/Download`,
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
        link.setAttribute("download", `${row.docID}${row.docExt}`);
  
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

  export const exportToPDF = (columns, selectedRows) => {
    const head = [columns.map((item) => (item.headerName)).slice(0, columns.length - 1)]
    const body = selectedRows.map((row) => [
        row.batchNo,
        row.productCode,
        row.sectionCode,
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
        { field: 'batchNo', headerName: 'Batch No', flex: 1 },
        { field: 'productCode', headerName: 'Product Code', flex: 1 },
        { field: 'sectionCode', headerName: 'Section Code', flex: 1 },
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
                        title="Edit"
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<Event />}
                        label="Batch Event"
                        title="Batch Event"
                        onClick={handleDeleteClick(row)}
                        color="inherit"
                    />,
                ];
            },
        },
    ]
)
export const initialState = {
    prodcode: '',
    sectionCode: '',
    batchNo: "",
    tempCode: '',
    Template: null,
    product: null,
    stageCode: "",
    mpUnitCode: "",
    stepCode:"",
    stage: null,
    Step: null,
    RequestBody: {
        "sectionCode": "",
        "productCode": "",
        "batchNo": "",
        "docs": [],
        "tenantId": "1038"
    }
}

export const InitialDoc = {
    "docTitle": "",
    "referenceNo": "",
    "docRelTo": "",
    "comments": "",
    "docID": "",
    "docDesc": "",
    "docExt": "",
    "stgCode": "",
    "uoCode": "",
    "stpCode": ""
}
export const Options = {
    batch: false,
    stage: false,
    unitOperation: false,
    step: false,
}