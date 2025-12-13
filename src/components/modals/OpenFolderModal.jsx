import Toast from "../Toast";
import common from "@/common/common.js";
import { useContext, useState } from "react";
import AddFolderModal from "./AddFolderModal";
import AddDocumentModal from "./AddDocumentModal";
import CreateFolderModal from "./CreateFolderModal";
import statusContext from "@/context/statusContext";
import { errorMessage, fileSize } from "@/lib/utils";
import DynamicTableCheckBoxAction from "../tables/DynamicTableActionCheckbox";
import UniversalAssets from "../component/UniversalAssets";

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
              <UniversalAssets asset={"x"} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            {/* Top Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddFolderModal(true)}
                className="flex cursor-pointer items-center gap-1 rounded-md border border-amber-500 bg-amber-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-amber-600 hover:shadow-md"
              >
                <UniversalAssets
                  asset={"folder"}
                  className={"fill-white"}
                  size={22}
                />
                <span>Add Folder</span>
              </button>

              <button
                onClick={() => setShowAddDocumentModal(true)}
                className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-500 bg-blue-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-blue-600 hover:shadow-md"
              >
                <UniversalAssets
                  asset={"file"}
                  className={"fill-white"}
                  size={22}
                />
                <span>Add Document</span>
              </button>

              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="flex cursor-pointer items-center gap-1 rounded-md border border-teal-500 bg-teal-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-teal-600 hover:shadow-md"
              >
                <UniversalAssets
                  asset={"folderPlus"}
                  className={"fill-white"}
                  size={22}
                />
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
                onClick={handleSearch}
                className="flex cursor-pointer items-center gap-1 rounded-md border border-green-500 bg-green-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-green-600 hover:shadow-md"
              >
                <UniversalAssets asset={"search"} />
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
              className="flex cursor-pointer items-center gap-1 rounded-md border border-sky-500 bg-sky-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-sky-600 hover:shadow-md"
            >
              <UniversalAssets asset={"fileZip"} />
              <span>Generate Zip</span>
            </button>

            <button
              onClick={() => handleDelete()}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-red-500 bg-red-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-red-600 hover:shadow-md"
            >
              <UniversalAssets asset={"trash"} />
              <span>Delete</span>
            </button>

            <button
              onClick={handleBack}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-500 bg-slate-500 px-2 py-1.5 text-white shadow-sm transition-all duration-300 hover:bg-slate-600 hover:shadow-md"
            >
              <UniversalAssets asset={"arrowLeft"} />
              <span>Back</span>
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
