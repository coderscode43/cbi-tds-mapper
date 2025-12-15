import common from "@/common/common";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import Pagination from "@/components/Pagination";
import SelectField from "@/components/SelectField";
import DynamicTableAction from "@/components/tables/DynamicTableAction";
import staticDataContext from "@/context/staticDataContext";
import statusContext from "@/context/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { errorMessage } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
  { name: "Import Raw Files", panelName: "Import Raw Files" },
  { name: "Import BGL Balance", panelName: "Import BGL Balance" },
  { name: "Import GH15 & LDC File", panelName: "Import GH15 & LDC File" },
  { name: "Import PAN Details", panelName: "Import PAN Details" },
  { name: "TDS Exception", panelName: "TDS Exception" },
];

const Withdrawal = () => {
  const pageName = "Withdrawal";

  const { params } = useParams();
  const parsedParams = JSON.parse(params);

  const navigate = useNavigate();

  const baseUrl = import.meta.env.BASE_URL;

  const fileInputRef = useRef({});

  const {
    crtFy,
    crtMonth,
    crtQuarter,
    monthList,
    ClientPAN,
    typeOfForm,
    Quarter,
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
    typeOfForm: "Interest",
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

  const handleOpenFolderClick = async (objKey) => {
    setShowOpenFolderModal(true);

    try {
      setRowLoading(true);
      const entity = "WorkingFile";
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

  const handleProcessButtonClick = async (processName) => {
    const entity = "Withdrawal";
    const fileTypeValue = Array.isArray(typeOfForm)
      ? typeOfForm[0]
      : typeOfForm;

    const formData = {
      ...parsedParams,
      typeOfForm: fileTypeValue,
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
      typeOfForm: updatedSearchParams.typeOfForm || searchParams.typeOfForm,
      panelName: panelName,
      pageName: pageName,
    };

    const refinedParams = common.getRefinedSearchParams(searchObj);

    // Navigate to the updated URL
    navigate(`/home/listSearch/withdrawal/${refinedParams}`);
  };

  const handleTabChange = (selectedPanelName) => {
    const updatedParams = {
      ...parsedParams,
      panelName: selectedPanelName,
    };

    const refinedParams = common.getRefinedSearchParams(updatedParams);
    navigate(`/home/listSearch/withdrawal/${refinedParams}`);
  };

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
        <h1 className="mb-4 text-[25px] font-medium">Withdrawal</h1>

        {/*  Filters Section */}
        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-end justify-between gap-4">
            <div className="flex w-full gap-5">
              {/* Financial Year */}
              <SelectField
                label="Financial Year"
                name="fy"
                options={financialYear}
                value={parsedParams.fy || crtFy}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "fy", value } })
                }
              />

              <SelectField
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

              <SelectField
                label="Month"
                name="month"
                options={filteredMonths}
                value={parsedParams.month || crtMonth}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "month", value } })
                }
              />

              <SelectField
                label="Form"
                name="form"
                className={"w-68.5"}
                options={Quarter}
                value={parsedParams.form || ""}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "form", value } })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end justify-end gap-5">
            <button
              onClick={() => handleOpenFolderClick("additionalFolder")}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                className="h-7 w-7 mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/OpenFolder.gif`}
                alt="Refresh"
              />
              <span>Open Additional Folder</span>
            </button>

            <button
              onClick={() => handleOpenFolderClick()}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                className="h-7 w-7 mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/OpenFolder.gif`}
                alt="Open Folder"
              />
              <span>Open Folder</span>
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
            <div className="mb-5 rounded-md bg-gray-100 p-2">
              <TabList className="flex gap-3">
                {categories?.map(({ name, panelName }) => (
                  <Tab
                    key={panelName}
                    className={({ selected }) =>
                      `w-full cursor-pointer rounded-md px-3 py-2.5 font-medium transition-all duration-300 ${
                        selected
                          ? "bg-blue-500 text-white shadow-md focus:outline-none"
                          : "text-gray-700 focus:outline-none"
                      } `
                    }
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels className="mt-3">
              <TabPanel
                key={"Import Raw Files"}
                className="flex w-full items-end justify-between"
              >
                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">
                      Import Current Month Details
                    </h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>

                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">Import Refund Details</h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>
              </TabPanel>

              <TabPanel
                key={"Import BGL Balance"}
                className="flex w-full items-end justify-between"
              >
                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">Import BGL Balance</h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>

                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">
                      Import BGL Transaction
                    </h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>
              </TabPanel>

              <TabPanel
                key={"Import GH15 & LDC File"}
                className="flex w-full items-end justify-between"
              >
                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">Import GH15 File</h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>

                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">Import LDC File</h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>
              </TabPanel>

              <TabPanel
                key={"Import PAN Details"}
                className="flex w-full items-end justify-between"
              >
                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">Import PAN Details</h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>

                <div className="flex w-full items-end gap-5">
                  <div>
                    <h4 className="mb-10 font-medium">Import ITR File</h4>
                    <label className="block">Select Folder</label>
                    <input
                      type="file"
                      id="importFile"
                      name="importFile"
                      ref={(el) => (fileInputRef.current[0] = el)}
                      onChange={(e) => setSelectedDocuments(e.target.files[0])}
                      className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleImport}
                    className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                  >
                    <img
                      className="h-7 w-7 mix-blend-multiply"
                      src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                      alt="Import File"
                    />
                    <span>Import File</span>
                  </button>
                </div>
              </TabPanel>

              <TabPanel
                key={"TDS Exception"}
                className={"flex items-end justify-start gap-5"}
              >
                <div>
                  <h4 className="mb-10 font-medium">TDS Exception</h4>
                  <label className="block">Select Folder</label>
                  <input
                    type="file"
                    id="importFile"
                    name="importFile"
                    ref={(el) => (fileInputRef.current[0] = el)}
                    onChange={(e) => setSelectedDocuments(e.target.files[0])}
                    className="w-72 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleImport}
                  className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
                >
                  <img
                    className="h-7 w-7 mix-blend-multiply"
                    src={`${import.meta.env.BASE_URL}/images/gificons/importFile.gif`}
                    alt="Import File"
                  />
                  <span>Import File</span>
                </button>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>

        {/* Process Buttons */}
        <div className="flex justify-between rounded-md border border-gray-100 bg-white p-6 shadow-lg">
          {/* Column 1 */}
          <div className="space-y-5">
            <button
              onClick={() => handleProcessButtonClick("GetPAN")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/generatefile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Get PAN</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("UploadOnWeb")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/uploadfile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Upload On Web</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("Validate&GetS.D")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/generateupdatefile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Validate & Get S.D</span>
            </button>
          </div>

          {/* Column 2 */}
          <div className="space-y-5">
            <button
              onClick={() => handleProcessButtonClick("Validate&GetS.D")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/generateupdatefile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Validate & Get S.D</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("DownloadRawDetails")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/DownloadFile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Download Raw Details</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("GLReport")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/Excelfile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>GL Report</span>
            </button>
          </div>

          {/* Column 3 */}
          <div className="space-y-5">
            <button
              onClick={() => handleProcessButtonClick("GLReconciliation")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/ValidateExcel.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>GL Reconciliation</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("GetPAN")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/generatefile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Get PAN</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("GenerateTTUM&TINFile")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/txtFile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Generate TTUM & TIN File</span>
            </button>
          </div>
        </div>

        {/* Process Buttons 2 */}
        <div className="flex justify-between rounded-md border border-gray-100 bg-white p-6 shadow-lg">
          {/* Column 1 */}
          <div className="space-y-5">
            <button
              onClick={() =>
                handleProcessButtonClick("DownloadCurrentMonthDetails")
              }
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/DownloadFile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Download Current Month Details</span>
            </button>

            <button
              onClick={() => handleProcessButtonClick("GenerateTTUM&TINFile")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/txtFile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Generate TTUM & TIN File</span>
            </button>
          </div>

          {/* Column 2 */}
          <div className="space-y-5">
            <button
              onClick={() => handleProcessButtonClick("GLReconciliation")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/ValidateExcel.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>GL Reconciliation</span>
            </button>
          </div>

          {/* Column 3 */}
          <div className="space-y-5">
            <button
              onClick={() => handleProcessButtonClick("DownloadRefundDetails")}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                src={`${import.meta.env.BASE_URL}/images/gificons/DownloadFile.gif`}
                className="h-7 w-7 mix-blend-multiply"
              />
              <span>Download Refund Details</span>
            </button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="flex flex-col gap-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-medium">Activity Log</h1>
              <p className="text-md">Track all the actions and their status</p>
            </div>

            <button
              onClick={() => fetchListData()}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md"
            >
              <img
                className="h-7 w-7 mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/gificons/refresh.gif`}
                alt="Refresh"
              />
              <span>Refresh</span>
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

export default Withdrawal;
