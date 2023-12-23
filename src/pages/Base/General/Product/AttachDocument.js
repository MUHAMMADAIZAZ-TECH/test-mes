import React, { useState } from "react";
import {
  CustomButton,
  CustomInputLabel,
  CustomOutlinedInput,
  FileUploadButton,
  CustomTable
} from "../../../../components";
import { Grid } from "@mui/material";
import { Done } from "@mui/icons-material";
import { deleteProdDoc, downloadFile, uploadFile } from "./Apis";

const AttachDocument = ({
  product,
  documents,
  setDocuments,
  handleSnackbarOpen,
}) => {
  const [document, setDocument] = useState({
    file: {},
    title: "",
    description: "",
    fileName: "",
  });
  const onBrowse = (file) => {
    setDocument((prevState) => {
      return {
        ...prevState,
        file: file,
        fileName: file.name,
      };
    });
  };

  const uploadDocument = () => {
    setDocument({ file: {}, title: "", description: "", fileName: "" });
    const formData = new FormData();
    formData.append("file", document.file);

    let doc = {
      sectionCode: product.section.sectionCode,
      productCode: product.prodcode,
      title: document.title,
      description: document.description,
      tenantId: "1038",
    };

    uploadFile(formData, doc, setDocuments, handleSnackbarOpen);
  };
  const removeDocument = (row) => {
    deleteProdDoc(row, setDocuments, handleSnackbarOpen);
  };
  const downloadDoc = (row) => {
    downloadFile(row);
  };

  return (
    <div>
      <Grid display="flex" alignItems="center" container spacing={2}>
        <Grid item xs={2}>
          <CustomInputLabel required label="Title" />
        </Grid>
        <Grid item xs={10}>
          <CustomOutlinedInput
            value={document?.title}
            onChange={(e) => {
              setDocument((prevState) => {
                return {
                  ...prevState,
                  title: e.target.value,
                };
              });
            }}
            sx={{ marginRight: "16px" }}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel required label="Description" />
        </Grid>
        <Grid item xs={10}>
          <CustomOutlinedInput
            value={document?.description}
            onChange={(e) => {
              setDocument((prevState) => {
                return {
                  ...prevState,
                  description: e.target.value,
                };
              });
            }}
            sx={{ marginRight: "16px" }}
            width={"100%"}
            multiline
            minRows={2}
          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputLabel required label="File" />
        </Grid>
        <Grid item xs={7}>
          <CustomOutlinedInput
            value={document?.fileName}
            sx={{
              marginRight: "12px",
            }}
            width={"100%"}
          />
        </Grid>
        <Grid item xs={3}>
          <FileUploadButton
            text="Browse"
            onChange={onBrowse}
            backgroundColor="#3498DB"
            additionalStyles={{ marginRight: "16px" }}
          />
          <CustomButton
            startIcon={<Done />}
            backgroundColor="#28B463"
            variant={"contained"}
            onClick={uploadDocument}
          >
            Upload
          </CustomButton>
        </Grid>
        <Grid item xs={12}>
          <CustomTable
            data={documents}
            tableHeader={tableHeaderDocument}
            showCheckBox={false}
            showDeleteButton={true}
            onDelete={removeDocument}
            showDownloadButton={true}
            onDownload={downloadDoc}
            containerStyles={{ maxHeight: "150px", overflowY: "auto" }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const tableHeaderDocument = [
  {
    id: "documentId",
    label: "Document Title",
    field: "documentId",
  },
];

export default AttachDocument;
