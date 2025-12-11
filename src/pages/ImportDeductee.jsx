import common from "@/common/common";
import FilterSelect from "@/components/FilterSelect";
import Pagination from "@/components/Pagination";
import statusContext from "@/context/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import staticDataContext from "@/context/staticDataContext";
import { errorMessage, refinedSearchParams } from "@/lib/utils";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import DynamicTableAction from "@/components/tables/DynamicTableAction";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const categories = [
  { name: "Import Raw Files", panelName: "Import Raw Files" },
  { name: "Import GL Files", panelName: "Import GL Files" },
  { name: "Import GH15 File", panelName: "Import GH15 File" },
  { name: "Import LDC Files", panelName: "Import LDC Files" },
  {
    name: "Import Refund & Recovery File",
    panelName: "Import Refund Recovery File",
  },
  { name: "Latest Updated PAN", panelName: "Latest Updated PAN" },
];

const ImportDeductee = () => {
  const pageName = "Import Deductee";

  const baseUrl = import.meta.env.BASE_URL;

  const { params } = useParams();

  const navigate = useNavigate();

  const fileInputRef = useRef({});

  const {
    crtFy,
    crtMonth,
    crtQuarter,
    monthList,
    ClientPAN,
    typeOfFile,
    financialYear,
  } = useContext(staticDataContext);
  const { showSuccess, showError, showOverride } = useContext(statusContext);

  const [listData, setListData] = useState([]);
  const [rowLoading, setRowLoading] = useState(false);
  const [fileListData, setFileListData] = useState([]);
  const [lastLocation, setLastLocation] = useState("");
  const [selectedDocument, setSelectedDocuments] = useState("");
  const [gotoPage, setGotoPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [showOpenFolderModal, setShowOpenFolderModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    fy: "",
    month: "",
    quarter: "",
    typeOfFile: "Interest",
    panelName: params?.panelName || "",
  });

  // Custom hook to lock body scroll. Prevent scrolling when modal is open
  useLockBodyScroll(showOpenFolderModal);

  // Filter months based on selected quarter
  const quarterToUse = searchParams.quarter || crtQuarter;
  const filteredMonths = monthList?.[quarterToUse] || [];

  const fetchListData = async (baseUrlParam = baseUrl) => {
    try {
      setRowLoading(true);
      const pageNo = 0;
      const resultPerPage = 100;
      const entity = "ProcessDetail";

      const response = await common.getSearchListData(
        entity,
        pageNo,
        resultPerPage,
        params,
        baseUrlParam
      );

      setListData(response?.data?.entities || []);

      const count = response?.data?.count || 0;
      const pages = Math.ceil(count / 100);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching list data:", error);
    } finally {
      setRowLoading(false);
    }
  };

  useEffect(() => {
    fetchListData();
  }, [params]);

  // Table Details
  const tableHead = [
    { key: "srNo", label: "Sr.No" },
    { key: "addedBy", label: "Added By" },
    { key: "addedOn", label: "Added On" },
    { key: "processName", label: "Process Name" },
    { key: "status", label: "Status" },
    { key: "remark", label: "Remark" },
    { key: "completedOn", label: "Completed On" },
    { key: "action", label: "Action" },
  ];

  const tableData = listData?.map((data, index) => ({
    srNo: (currentPage - 1) * 100 + (index + 1),
    ...data,
  }));

  //console.log(params);

  const handleOpenFolderClick = async (objKey) => {
    setShowOpenFolderModal(true);

    try {
      setRowLoading(true);
      const entity = "WorkingFile";
      const parsedParams = JSON.parse(params);
      const clientPAN = ClientPAN;
      const formData = {
        ...parsedParams,
        pan: clientPAN,
        pageName: pageName,
      };
      let updatedFormData;
      if (objKey === "additionalDetails") {
        updatedFormData = {
          ...formData,
          [objKey]: "Additional Details",
        };
      } else if (objKey === "excel") {
        updatedFormData = {
          ...formData,
          [objKey]: "refundAndRecovery",
        };
      } else {
        updatedFormData = {
          ...formData,
        };
      }

      const refinedFormData = common.getRefinedSearchParams(updatedFormData);
      const response = await common.getFileList(entity, refinedFormData);
      console.log(formData);
      console.log(refinedFormData);

      setFileListData(response?.data || []);
      setLastLocation(response.data[0].lastLocation || "");
    } catch (error) {
      console.error(error);
    } finally {
      setRowLoading(false);
    }
  };

  const fileTypeValue = Array.isArray(typeOfFile) ? typeOfFile[0] : typeOfFile;

  const handleProcessButtonClick = async (processName) => {
    const entity = "ImportDeductee";
    const parsedParams = JSON.parse(params);

    const formData = {
      ...parsedParams,
      typeOfFile: fileTypeValue,
      processName: processName,
    };

    try {
      await common.getStartProcess(entity, formData);
      showSuccess(
        `${processName.replace(/(?!^)([A-Z])/g, " $1")} is in progress`
      );
    } catch (error) {
      showError(
        `Cannot start process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
      );
      console.error(error);
    }
  };

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;
    const updatedSearchParams = { ...searchParams, [name]: value };
    const panelName = activeCategory;
    //console.log(panelName);

    // If quarter changes, update month to the first month of that quarter
    if (name === "quarter") {
      updatedSearchParams.month = monthList?.[value]?.[0] || "";
    }

    setSearchParams(updatedSearchParams);

    const searchObj = {
      pan: ClientPAN,
      fy: updatedSearchParams.fy || crtFy,
      month: updatedSearchParams.month || crtMonth,
      quarter: updatedSearchParams.quarter || crtQuarter,
      typeOfFile: updatedSearchParams.typeOfFile || searchParams.typeOfFile,
      panelName: panelName.panelName,
      pageName: pageName,
    };

    const refinedParams = refinedSearchParams(searchObj);

    // Navigate to the updated URL
    navigate(`/home/listSearch/importDeductee/${refinedParams}`);
  };

  const handleTabChange = (selectedPanelName) => {
    const updatedParams = {
      ...parsedParams,
      panelName: selectedPanelName,
    };

    const refinedParams = common.getRefinedSearchParams(updatedParams);
    navigate(`/home/listSearch/importDeductee/${refinedParams}`);
  };

  let parsedParams = {};
  try {
    parsedParams = JSON.parse(params);
  } catch (error) {
    console.log("Params not JSON parsable:", params, error);
  }

  const handleProcessCancel = async (data, confirm = "NO") => {
    const processName = data?.processName;
    const id = data?.id;

    // This triggers your override modal
    if (confirm === "NO") {
      showOverride(
        `Are you sure you want to terminate the process ${processName}?`,
        () => handleProcessCancel(data, "YES")
      );
    } else {
      // This part runs only when the user clicks “Yes”
      try {
        setRowLoading(true);
        const response = await common.getProcessCancel(id);
        showSuccess(response?.data?.message);
      } catch (error) {
        showError(
          `Cannot terminate process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
        );
      } finally {
        setRowLoading(false);
      }
    }
  };

  const activeTabIndex = categories.findIndex(
    (c) => c.panelName === parsedParams?.panelName
  );
  const activeCategory = categories.find(
    (c) => c.panelName === parsedParams?.panelName
  );

  const selectedTab = activeTabIndex >= 0 ? activeTabIndex : 0;

  const subPanel = activeCategory?.panelName;

  const handleImport = async () => {
    try {
      const response = await common.getImportFile(
        selectedDocument,
        subPanel,
        params
      );
      setSelectedDocuments({});
      showSuccess(response.data.message);
      // Reset the specific file input
      if (fileInputRef.current[0]) {
        fileInputRef.current[0].value = "";
      }
    } catch (error) {
      showError(`Cannot start process ${subPanel}: ${errorMessage(error)}`);
      console.error(error);
      setSelectedDocuments({});
    }
  };

  return (
    <>
      <div className="custom-scrollbar space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">Import Deductee</h1>

        {/*  Filters Section */}
        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-end justify-between gap-4">
            <div className="flex w-full gap-5">
              {/* Financial Year */}
              <FilterSelect
                label="Financial Year"
                name="fy"
                options={financialYear}
                value={parsedParams.fy || crtFy}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "fy", value } })
                }
              />

              <FilterSelect
                label="Month"
                name="month"
                options={filteredMonths}
                value={parsedParams.month || crtMonth}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "month", value } })
                }
              />

              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Object.keys(monthList || {})}
                value={parsedParams.quarter || crtQuarter}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "quarter", value },
                  })
                }
              />

              {/* Type of File */}
              <FilterSelect
                label="Type of file"
                name="typeOfFile"
                options={typeOfFile}
                value={parsedParams.typeOfFile || ""}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "typeOfFile", value },
                  })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-5">
            <button
              className="btnBorder lightYellow btn"
              onClick={() => handleOpenFolderClick("additionalDetails")}
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/openfile.gif`}
                alt="Add Bulk Token"
                className="h-7 mix-blend-multiply"
              />
              <span className="text-[16px]">Open Additional Details</span>
            </button>
            <button
              className="btnBorder lightYellow btn cursor-pointer"
              onClick={() => handleOpenFolderClick()}
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/OpenFolder.gif`}
                alt="Add Bulk Token"
                className="h-7 mix-blend-multiply"
              />
              <span className="text-[16px]">Open Folder</span>
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="rounded-md border border-gray-100 p-5 shadow-lg">
          <TabGroup
            selectedIndex={selectedTab}
            onChange={(index) => handleTabChange(categories[index].panelName)}
            className="w-full"
          >
            <div className="w-full rounded-md bg-gray-200 p-1.5">
              <TabList className="flex gap-4">
                {categories?.map(({ name, panelName }) => (
                  <Tab
                    key={panelName}
                    className={({ selected }) =>
                      `text-md w-full cursor-pointer rounded-sm py-2 font-bold focus:outline-none ${
                        selected
                          ? "text-md bg-white font-bold shadow"
                          : "text-sm font-bold text-gray-800 hover:bg-gray-100"
                      }`
                    }
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>
            </div>
            <TabPanels className="mt-3">
              {categories?.map(({ panelName }) => (
                <TabPanel
                  key={panelName}
                  className="flex items-end gap-5 p-4 pl-0 focus:outline-none"
                >
                  <div>
                    <label className="text-md font-bold text-black">
                      Select Folder
                    </label>
                    <input
                      type="file"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      id="importFile"
                      className="block w-full cursor-pointer rounded-[7px] border border-[#0000004d] bg-white px-3 py-2.5 text-sm leading-[1.8] font-normal text-[#303e67] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-[border-color,box-shadow] duration-150 ease-in-out placeholder:text-[#7d8fb3] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    className="btnBorder lightCyan btn"
                    onClick={handleImport}
                  >
                    <img
                      className="h-[35px] w-[35px] mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import"
                    />
                    <span>Import File</span>
                  </button>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>

        {/* Process Buttons */}
        <div className="rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex justify-evenly gap-3">
            <button
              onClick={() => handleProcessButtonClick("GenerateFormatFile")}
              className="btnBorder lightBlue btn"
            >
              <img
                className="h-[35px] w-[35px] mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/generatefile.gif`}
                alt="Generate Format File"
              />
              <span>Generate Format File</span>
            </button>

            <button
              onClick={() =>
                handleProcessButtonClick("LaunchRefundAndRecoveryExcel")
              }
              className="btnBorder lightBlue btn"
            >
              <img
                className="h-[35px] w-[35px] mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/generateexcelfile.gif`}
                alt="LaunchRefundAndRecoveryExcel"
              />
              <span>Launch Refund And Recovery Excel</span>
            </button>

            <button
              onClick={() =>
                handleProcessButtonClick("ValidateDataAndSegregateData")
              }
              className="btnBorder lightBlue btn"
            >
              <img
                className="h-[35px] w-[35px] mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/ValidateExcel.gif`}
                alt="ValidateDataAndSegregateData"
              />
              <span>Validate Data And Segregate Data</span>
            </button>
          </div>

          <div className="mt-8 flex justify-evenly gap-3">
            <button
              onClick={() => handleProcessButtonClick("GenerateReport")}
              className="btnBorder lightBlue btn"
            >
              <img
                className="h-[35px] w-[35px] mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/generateupdatefile.gif`}
                alt="GenerateReport"
              />
              <span>Generate Report</span>
            </button>

            <button
              onClick={() => handleOpenFolderClick("excel")}
              className="btnBorder lightBlue btn"
            >
              <img
                className="h-[35px] w-[35px] mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/Excelfile.gif`}
                alt="OpenExcelFolder"
              />
              <span>Open Excel Folder</span>
            </button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="flex flex-col gap-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-black">Activity Log</h1>
              <p className="text-md">Track all the actions and their status</p>
            </div>

            <button
              className="btnBorder Green btn"
              onClick={() => fetchListData()}
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/refresh.gif`}
                alt="Export to Excel Button"
                className="h-7 mix-blend-multiply"
              />
              <span className="w-full text-[16px]">Refresh</span>
            </button>
          </div>

          <DynamicTableAction
            tableHead={tableHead}
            tableData={tableData}
            rowLoading={rowLoading}
            handleCancel={handleProcessCancel}
          />
        </div>

        {/*  Modal */}
        {showOpenFolderModal && (
          <OpenFolderModal
            onClose={() => setShowOpenFolderModal(false)}
            fileListData={fileListData}
            setFileListData={setFileListData}
            lastLocation={lastLocation}
            setLastLocation={setLastLocation}
          />
        )}
      </div>

      {/*  Pagination */}
      {listData.length > 0 && (
        <Pagination
          entity={pageName}
          setListData={setListData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          gotoPage={gotoPage}
          setGotoPage={setGotoPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
};

export default ImportDeductee;
