import Toast from "../Toast";
import common from "@/common/common.js";
import { useContext, useState } from "react";
import AddFolderModal from "./AddFolderModal";
import AddDocumentModal from "./AddDocumentModal";
import CreateFolderModal from "./CreateFolderModal";
import statusContext from "@/context/statusContext";
import { errorMessage, fileSize } from "@/lib/utils";
import DynamicTableCheckBoxAction from "../tables/DynamicTableActionCheckbox";

const OpenFolderModal = ({
  onClose,
  fileListData,
  lastLocation,
  setLastLocation,
  setFileListData,
}) => {
  const entity = "WorkingFile";

  const { showSuccess, showError } = useContext(statusContext);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  // Table Details
  const tableHead = [
    { key: "name", label: "File Name" },
    { key: "lastModified", label: "Last Modified" },
    { key: "fileType", label: "File Type" },
    { key: "size", label: "File Size", formatter: fileSize },
    { key: "action", label: "Action" },
  ];

  const closeAddFolderModal = () => setShowAddFolderModal(false);
  const closeAddDocumentModal = () => setShowAddDocumentModal(false);
  const closeCreateFolderModal = () => setShowCreateFolderModal(false);

  const handleSearch = async () => {
    try {
      const response = await common.getSearchOpenFolder(
        lastLocation,
        fileListData
      );
      setFileListData(response?.data?.entities);
      setLastLocation(response?.data?.entities?.[0].lastLocation);
      setSelectedRows([]);
      setSelectedRowsData([]);
    } catch (error) {
      showError(
        `Cannot search.
       ${error?.response?.data?.entityName || ""}
       ${errorMessage(error)}`
      );
    }
  };

  const handleBack = async () => {
    const currentLastLocation = fileListData[0]?.lastLocation;
    const lastPart = currentLastLocation?.substring(
      currentLastLocation.lastIndexOf("/") + 1
    );

    try {
      const response = await common.getGotoLastLocation(
        currentLastLocation,
        lastPart
      );
      console.log(response);

      const newData = response?.data?.entities || [];
      setFileListData(newData);

      // Update lastLocation if new data exists
      if (newData.length > 0) {
        setLastLocation(newData[0]?.lastLocation || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateZip = async () => {
    if (selectedRows.length === 0) {
      showError("Please select at least one folder to generate zip.");
      return;
    } else if (selectedRows.length > 1) {
      showError(
        "Please select only one folder to proceed with ZIP generation."
      );
      return;
    }

    try {
      const response = await common.getGenerateZipFile(
        fileListData,
        selectedRowsData
      );
      console.log(response.data);

      if (response?.data?.entities) {
        setFileListData(response?.data?.entities);
        showSuccess("ZIP file Created Successfully");
        setSelectedRows([]);
        setSelectedRowsData([]);
      }
    } catch (error) {
      showError("error.response.data.exceptionMsg");
      console.error("Error generating zip:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      showError("Please select at least one folder or file to Delete.");
      return;
    }
    const formData = {
      entity: {
        deleteFileOrFolder: selectedRowsData,
      },
      lastLocation: fileListData[0]?.lastLocation,
    };

    try {
      // Call the API to delete
      const response = await common.getFileDeleted(JSON.stringify(formData));

      if (response?.data?.entities) {
        setFileListData(response.data.entities);
        Toast("Deleted Successfully");

        setSelectedRows([]);
        setSelectedRowsData([]);
      }
    } catch (error) {
      showError(errorMessage(error));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-100 px-6 py-4">
            <h2 className="text-lg font-bold text-black">Working File</h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-xl text-gray-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            {/* Top Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="cursor-pointer rounded-lg bg-gradient-to-r from-cyan-500/95 to-blue-600 px-4 py-2 text-[16px] font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:from-cyan-600 hover:to-blue-700 hover:shadow-lg"
                onClick={() => setShowAddFolderModal(true)}
              >
                <i className="fa-solid fa-folder"></i>&nbsp;&nbsp;
                <span>Add Folder</span>
              </button>
              <button
                className="cursor-pointer space-x-1 rounded-md bg-gradient-to-r from-red-500 to-red-800 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-700 hover:to-red-500 hover:shadow-lg"
                onClick={() => setShowAddDocumentModal(true)}
              >
                <i className="fa-solid fa-file"></i>&nbsp;
                <span>Add Document</span>
              </button>
              <button
                className="cursor-pointer space-x-1 rounded-md bg-gradient-to-r from-green-500 to-green-800 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:from-green-700 hover:to-green-500 hover:shadow-lg"
                onClick={() => setShowCreateFolderModal(true)}
              >
                <i className="fa-solid fa-folder-plus"></i>&nbsp;
                <span>Create Folder</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <input
                id="lastLocation"
                name="lastLocation"
                type="text"
                value={lastLocation}
                placeholder="Add Bulk Token Number"
                className="flex-grow rounded-md border border-gray-300 px-4 py-1.5 text-[15px] text-gray-700 focus:outline-none"
                onChange={(e) => setLastLocation(e.target.value)}
              />
              <button
                className="cursor-pointer space-x-1 rounded-md bg-green-500 px-3 py-1.5 text-white hover:bg-green-600"
                onClick={handleSearch}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {/* Table */}
            <DynamicTableCheckBoxAction
              entity={entity}
              tableHead={tableHead}
              tableData={fileListData}
              selectedRows={selectedRows}
              setFileListData={setFileListData} //for going inside the table
              setSelectedRows={setSelectedRows}
              setLastLocation={setLastLocation} //for setting lastLocation
              setSelectedRowsData={setSelectedRowsData}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 bg-blue-100 px-6 py-4">
            <button
              onClick={handleGenerateZip}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-cyan-500/95 to-blue-600 px-4 py-2 text-[16px] font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:from-cyan-600 hover:to-blue-700 hover:shadow-lg"
            >
              <i className="fa-solid fa-file-zipper"></i>&nbsp;&nbsp;
              <span>Generate Zip</span>
            </button>
            <button
              onClick={() => handleDelete()}
              className="cursor-pointer space-x-1 rounded-md bg-gradient-to-r from-red-500 to-red-800 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-700 hover:to-red-500 hover:shadow-lg"
            >
              <i className="fa-solid fa-trash"></i>&nbsp;
              <span>Delete</span>
            </button>
            <button
              className="cursor-pointer space-x-1 rounded-md bg-gradient-to-r from-gray-500 to-gray-800 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:from-gray-700 hover:to-gray-500 hover:shadow-lg"
              onClick={handleBack}
            >
              <i className="fa-solid fa-arrow-left"></i> <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {showAddFolderModal && (
        <AddFolderModal
          fileListData={fileListData}
          setFileListData={setFileListData}
          closeAddFolderModal={closeAddFolderModal}
        />
      )}

      {showAddDocumentModal && (
        <AddDocumentModal
          fileListData={fileListData}
          setFileListData={setFileListData}
          closeAddDocumentModal={closeAddDocumentModal}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          fileListData={fileListData}
          setFileListData={setFileListData}
          closeCreateFolderModal={closeCreateFolderModal}
        />
      )}
    </>
  );
};

export default OpenFolderModal;
