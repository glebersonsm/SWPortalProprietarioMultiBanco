type documentTypesProps = {
  [contentType: string]: string;
};

export const documentTypes: documentTypesProps = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/text": ".txt",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "video/3gpp": ".3gp",
  "video/3gpp2": ".3gp2",
  "video/mp4": ".mp4",
  "application/x-7z-compressed": ".7z",
  "application/x-rar-compressed": ".rar",
  "application/rtf": ".rtf",
  "application/richtext": ".rtx",
};

function getTypeToDownload(contentType: string): string | null {
  if (documentTypes.hasOwnProperty(contentType)) {
    return documentTypes[contentType];
  } else {
    return null;
  }
}

export default getTypeToDownload;
