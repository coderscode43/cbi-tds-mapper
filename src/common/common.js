import { parsedParams } from "@/lib/utils";

import {
  addFileInFolder,
  addFolder,
  createFolder,
  downloadFile,
  fileList,
  gotoFolder,
  gotoLastLocation,
  paginationListData,
  paginationWithSearchListData,
  startProcess,
  generateZipFile,
  fileDeleted,
  processCancelled,
  searchOpenFolder,
  importFile,
} from "@/service/apiService";

const common = {
  handleSearchInputChange: (e, setSearchParams) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  },

  getRefinedSearchParams: (searchParams) => {
    const refinedSearchParams = (obj) =>
      Object.fromEntries(
        Object.entries(obj)
          .map(([key, value]) => {
            // Trim whitespace if value is a string
            if (typeof value === "string") {
              value = value.trim();
            }
            return [key, value];
          })
          .filter(
            (entry) =>
              entry[1] !== "" && entry[1] !== null && entry[1] !== undefined
          )
          .map(([key, value]) => {
            // If value matches YYYY-MM-DD format, convert to ISO string
            if (
              typeof value === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(value)
            ) {
              return [key, new Date(value).toISOString()];
            }
            return [key, value];
          })
      );

    return JSON.stringify(refinedSearchParams(searchParams));
  },

  getSearchListData: async (entity, pageNo, resultPerPage, searchParams) => {
    return await paginationWithSearchListData(
      entity,
      pageNo,
      resultPerPage,
      searchParams
    );
  },

  getFileList: async (entity, formData) => {
    return await fileList(entity, formData);
  },

  getAddFolder: async (
    params,
    fileListData,
    selectedFolder,
    overrideValue = ""
  ) => {
    //  Helper to safely stringify objects and avoid cyclic reference errors
    const safeStringify = (obj) => {
      const seen = new WeakSet();
      try {
        return JSON.stringify(obj, (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return; // remove circular references
            seen.add(value);
          }
          return value;
        });
      } catch (err) {
        console.warn(" Failed to stringify object:", err, obj);
        return "{}";
      }
    };

    const parsedParams =
      typeof params === "string" ? JSON.parse(params) : params || {};

    const formData = {
      ...parsedParams,
      OverrideFile: overrideValue,
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";
    const formDataObj = new FormData();

    formDataObj.append("formData", safeStringify(formData));
    formDataObj.append("lastLocation", lastLocation);

    Array.from(selectedFolder).forEach((file) => {
      if (!file) return;
      formDataObj.append("blob", file);
      formDataObj.append("filePath", file.webkitRelativePath);
    });

    return await addFolder(formDataObj);
  },

  getAddFileInFolder: async (
    overrideValue,
    params,
    fileListData,
    selectedDocument
  ) => {
    const parsedParams = params ? JSON.parse(params) : {};
    const formData = {
      ...parsedParams,
      OverrideFile: overrideValue,
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";
    const fileBlob = [...selectedDocument];

    const formDataObj = new FormData();
    formDataObj.append("newDec", JSON.stringify(formData));
    formDataObj.append("dec", lastLocation);

    Array.from(fileBlob).forEach((file) => {
      if (!file) throw new Error("File is undefined");
      formDataObj.append("blob", file);
    });

    return await addFileInFolder(formDataObj);
  },

  getCreateFolder: async (params, fileListData, folderName, overrideValue) => {
    const parsedParams = params ? JSON.parse(params) : {};
    const formData = {
      ...parsedParams,
      OverrideFile: overrideValue,
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";

    return await createFolder(formData, lastLocation, folderName);
  },

  getGotoFolder: async (fileData) => {
    const lastLocation = fileData?.lastLocation;

    return await gotoFolder(lastLocation, fileData);
  },

  getGotoLastLocation: async (lastLocation, lastPart) => {
    return await gotoLastLocation(lastLocation, lastPart);
  },

  getStartProcess: async (entity, formData) => {
    await startProcess(entity, formData);
  },

  getPagination: async (entity, pageNo) => {
    return await paginationListData(entity, pageNo - 1);
  },

  getPaginationWithSearch: async (entity, pageNo, searchParams) => {
    return await paginationWithSearchListData(entity, pageNo - 1, searchParams);
  },

  getDownloadFile: async (entity, filePath) => {
    return await downloadFile(entity, filePath);
  },

  getGenerateZipFile: async (fileListData, selectedRowsData) => {
    const lastLocation = fileListData[0]?.lastLocation;
    const responseBody = {
      entity: {
        downloadFileOrFolder: selectedRowsData[0],
      },
      lastLocation: lastLocation,
    };
    return await generateZipFile(responseBody);
  },

  getFileDeleted: async (formDataObj) => {
    return await fileDeleted(formDataObj);
  },

  getProcessCancel: async (processId) => {
    return await processCancelled(processId);
  },

  getSearchOpenFolder: async (lastLocation, fileListData) => {
    const lastIndexFile = fileListData[fileListData.length - 1];
    return await searchOpenFolder(lastLocation, lastIndexFile);
  },

  getImportFile: async (selectedDocument, subpanel, parameters) => {
    const param = parsedParams(parameters);
    if (!selectedDocument) {
      throw new Error("Please select a document before importing.");
    }
    return await importFile(selectedDocument, subpanel, param);
  },
};

export default common;
