import common from "@/common/common";
import statusContext from "@/context/statusContext";
import Toast from "../Toast";
import { useContext } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { errorMessage } from "@/lib/utils";

const CreateFolderModal = ({
  setFileListData,
  fileListData,
  closeCreateFolderModal,
}) => {
  const { params } = useParams();
  const { showError, showOverride } = useContext(statusContext);
  const [folderName, setFolderName] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value.trim();
    if (value.length > 0) {
      setFolderName(value);
    } else {
      setFolderName(null);
    }
  };

  const handleCreateFolder = async (overrideValue) => {
    if (folderName) {
      try {
        const response = await common.getCreateFolder(
          params,
          fileListData,
          folderName,
          overrideValue
        );
        setFileListData(response?.data?.entities);
        closeCreateFolderModal();
        Toast("Folder Created Successfully");
      } catch (error) {
        console.error("Add folder error:", error);
        const message = error?.response?.data?.message;
        const exceptionMsg =
          error?.response?.data?.exceptionMsg ||
          error?.message ||
          "Unknown error";
        if (message === "Override") {
          showOverride(exceptionMsg, () => handleCreateFolder("YES"));
          closeCreateFolderModal();
        } else {
          showError(errorMessage);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-blue-100 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Create Folder</h2>
          <button
            onClick={() => closeCreateFolderModal()}
            className="cursor-pointer text-xl text-gray-500 transition hover:text-gray-800"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 px-6 py-5">
          <label className="block font-medium text-gray-700">
            Add Folder Name:
          </label>
          <input
            type="text"
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:outline-none"
          />
          {/* {selectedDocument && (
            <p className="text-sm text-gray-600">Selected: {selectedDocument}</p>
          )} */}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-blue-100 px-6 py-4">
          <button
            onClick={() => closeCreateFolderModal()}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <i className="fa-solid fa-xmark"></i> <span>Cancel</span>
          </button>
          <button
            onClick={() => handleCreateFolder("")}
            className={`flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700`}
          >
            <i className="fa-solid fa-folder-plus"></i>{" "}
            <span>Create Folder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
