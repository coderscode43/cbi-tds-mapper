import common from "@/common/common";
import statusContext from "@/context/statusContext";
import { errorMessage } from "@/lib/utils";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import UniversalAssets from "../component/UniversalAssets";
import { successToast } from "@/components/component/toast.jsx";

const AddDocumentModal = ({
  setFileListData,
  fileListData,
  closeAddDocumentModal,
}) => {
  const { params } = useParams();
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { showError, showOverride } = useContext(statusContext);

  const handleDocumentChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setSelectedDocument(files);
    } else {
      setSelectedDocument(null);
    }
  };

  const handleAddDocumentFolder = async (overrideValue) => {
    try {
      const response = await common.getAddFileInFolder(
        overrideValue,
        params,
        fileListData,
        selectedDocument
      );
      setFileListData(response?.data?.entities);
      closeAddDocumentModal();
      successToast("Document Added Successfully");
    } catch (error) {
      const message = error?.response?.data?.message;
      const exceptionMsg =
        error?.response?.data?.exceptionMsg ||
        error?.message ||
        "Unknown error";

      if (message === "OverrideMsg") {
        showOverride(exceptionMsg, () => handleAddDocumentFolder("YES"));
        closeAddDocumentModal();
      } else {
        showError(errorMessage(error));
        console.error("Add document error:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-blue-100 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Add Document</h2>
          <button
            onClick={() => closeAddDocumentModal(false)}
            className="cursor-pointer text-xl text-gray-500 transition hover:text-gray-800"
          >
            <UniversalAssets asset={"x"} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 px-6 py-5">
          <label className="block font-medium text-gray-700">
            Select a document:
          </label>
          <input
            type="file"
            onChange={handleDocumentChange}
            className="w-full cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-sm"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-blue-100 px-6 py-4">
          <button
            onClick={() => closeAddDocumentModal(false)}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <UniversalAssets asset={"x"} /> <span>Cancel</span>
          </button>
          <button
            onClick={() => handleAddDocumentFolder("")}
            disabled={!selectedDocument}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition ${
              selectedDocument
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-blue-300"
            }`}
          >
            <UniversalAssets asset={"folderPlus"} className={"fill-white"} />
            <span>Add Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;
