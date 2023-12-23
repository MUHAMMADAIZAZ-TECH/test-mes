import api from "../../../../api/api";

export const fetchPharmacyWeighing = async (state, setState, setLoading) => {
    setLoading({ loading: true, Found: false })
    try {
        const response = await api.get(`/PharmWeighing/${state.sectionCode}/${state.prodcode}/${state.batchNo}/${state.stageCode}`);
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
        "stageCode": "",
        "lot": [],
        "tenantId": "1038"
    }
}

export const InitialDoc = {
    "seqNo": "",
    "ingCode": "",
    "ingredient": "",
    "thQtyKg": "",
    "thQtyG": "",
    "adjstQtyKg": "",
    "adjstQtyG": "",
    "acQtyKg": "",
    "acQtyG": "",
    "subSeq": "",
    "thQtyMg": "",
    "acQtyMg": "",
    "adjstQtyMg": "",
    "comments": "",
    "selected": false,
    "setNo": ""
}
export const Options = {
    batch: false,
    stage: false,
    unitOperation: false,
    step: false,
}