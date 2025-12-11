import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? "/";
axios.defaults.withCredentials = true;

// Pagination Functionality
export const paginationListData = async () =>
  // entity, pageNo
  {
    // try {
    //   const response = await axios.get(
    //     `${API_BASE_URL}${entity}/list/get/${pageNo}/100`
    //   );
    return [];
    // } catch (error) {
    //   console.error("Error in fetching entities:", error);
    // }
  };

export const paginationWithSearchListData = async (
  entity,
  pageNo,
  resultPerPage,
  refinedSearchParams
) => {
  const response = await axios.get(
    `api${entity}/list/processCount/${pageNo}/${resultPerPage}`,
    {
      params: {
        processData: refinedSearchParams,
      },
    }
  );
  return response;
};

export const fileList = async (entity, formData) => {
  const response = await axios.get(`api${entity}/getFileList`, {
    params: {
      formData: formData,
    },
  });
  return response;
};

export const addFolder = async (formDataObj) => {
  const response = await axios.post(
    `apiWorkingFile/importFolderToPath`,
    formDataObj,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const addFileInFolder = async (formDataObj) => {
  const response = await axios.post(
    `apiWorkingFile/addFileInFolder`,
    formDataObj,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const createFolder = async (formData, lastLocation, folderName) => {
  const response = await axios.post(
    `apiWorkingFile/createFolder`,
    {},
    {
      params: {
        newdata: JSON.stringify(formData),
        lastLocation: lastLocation,
        name: folderName,
      },
    }
  );
  return response;
};

export const gotoFolder = async (lastLocation, fileData) => {
  const response = await axios.get(`apiWorkingFile/getFolder`, {
    params: {
      lastLocation: lastLocation,
      name: JSON.stringify(fileData),
    },
  });
  return response;
};

export const gotoLastLocation = async (lastLocation, lastPart) => {
  const response = await axios.get(`apiWorkingFile/gotoLastLocation`, {
    params: {
      lastLocation: lastLocation,
      crtLocation: lastPart,
    },
  });
  return response;
};

export const startProcess = async (entity, formData) => {
  const response = await axios.post(`api${entity}/startProcess`, formData);
  return response;
};

export const downloadFile = async (entity, filePath) => {
  const response = await axios.get(`api${entity}/downloadFile/${filePath}`, {
    responseType: "blob",
  });
  return response;
};

export const generateZipFile = async (data) => {
  const response = await axios.post(
    `apiWorkingFile/generateZipFileNFolder`,
    data
  );
  return response;
};

export const fileDeleted = async (formDataObj) => {
  const response = await axios.post(
    `apiWorkingFile/deleteFileNFolder`,
    formDataObj,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response;
};

export const processCancelled = async (processId) => {
  const response = await axios.post(`apiProcessDetail/cancel/${processId}`, {});
  return response;
};

export const searchOpenFolder = async (lastLocation, lastIndexFile) => {
  const crtLocation = lastIndexFile?.lastLocation;
  const response = await axios.get(`apiWorkingFile/searchLastLocation`, {
    params: {
      lastLocation: lastLocation,
      crtLocation: crtLocation,
    },
  });
  return response;
};

export const importFile = async (selectedDocument, subpanel, param) => {
  const data = {
    pan: param.pan,
    fy: param.fy,
    month: param.month,
    quarter: param.quarter,
    typeOfFile: param.typeOfFile,
    panelName: param.panelName,
    pageName: param.pageName,
    processName: "Bulk Import",
    subPanel: subpanel,
  };
  const formData = new FormData();
  formData.append("downloadFile", selectedDocument);
  formData.append(
    "formData",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  const response = await axios.post(`apiImportDeductee/importFile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const logout = async () => {
  try {
    const response = await axios.post("/logout");
    const currentUrl = window.location.href;

    const redirectUrl = `${response.data}?redirect=${encodeURIComponent(
      currentUrl
    )}`;

    window.location.href = redirectUrl;
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
