import React from "react";
import { downloadFile } from "../../Base/General/Product/Apis";
import { CustomTable } from "../../../components";

const MprDocuments = ({ documents }) => {
  const downloadDoc = (row) => {
    downloadFile(row);
  };

  return (
    <div>
      <CustomTable
        data={documents}
        tableHeader={tableHeaderDocument}
        showCheckBox={false}
        showDownloadButton={true}
        onDownload={downloadDoc}
        containerStyles={{ maxHeight: "150px", overflowY: "auto" }}
      />
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

export default MprDocuments;
