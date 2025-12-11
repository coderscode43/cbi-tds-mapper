import { useContext, useEffect, useState } from "react";
import FilterSelect from "@/components/FilterSelect";
import staticDataContext from "@/context/staticDataContext";
import { useParams } from "react-router-dom";

const Settings = () => {
  const { params } = useParams();

  const {
    crtFy,
    crtMonth,
    crtQuarter,
    monthList,
    typeOfFile,
    financialYear,
    //workingFileBasePath,
  } = useContext(staticDataContext);

  const [searchParams, setSearchParams] = useState(() => {
    const savedParams = JSON.parse(localStorage.getItem("settingsParams"));
    return (
      savedParams || {
        fy: "",
        month: "",
        quarter: "",
        typeOfFile: "Interest",
        panelName: params?.panelName || "",
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("settingsParams", JSON.stringify(searchParams));
  }, [searchParams]);

  //  Fetch list data
  useEffect(() => {
    const fetchListData = async () => {
      try {
        if (params) {
          setSearchParams({
            fy: "",
            month: "",
            quarter: "",
            typeOfFile: "",
            panelName: "",
          });
        }
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    };
    fetchListData();
  }, [params]);

  //  Handle filter change
  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;
    const updatedSearchParams = { ...searchParams, [name]: value };

    // If quarter changes, update month to the first month of that quarter
    if (name === "quarter") {
      updatedSearchParams.month = monthList?.[value]?.[0] || "";
    }

    setSearchParams(updatedSearchParams);
  };

  // Filter months based on selected quarter
  const quarterToUse = searchParams.quarter || crtQuarter;
  const filteredMonths = monthList?.[quarterToUse] || [];

  return (
    <>
      <div className="custom-scrollbar space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">Settings</h1>

        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-end justify-between gap-4">
            <div className="flex w-full gap-5">
              <FilterSelect
                label="Financial Year"
                name="fy"
                options={financialYear}
                value={searchParams.fy || crtFy}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "fy", value } })
                }
              />

              <FilterSelect
                label="Month"
                name="month"
                options={filteredMonths}
                value={searchParams.month || crtMonth}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "month", value } })
                }
              />

              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Object.keys(monthList || {})}
                value={searchParams.quarter || crtQuarter}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "quarter", value },
                  })
                }
              />

              <FilterSelect
                label="Type of file"
                name="typeOfFile"
                options={typeOfFile}
                value={searchParams.typeOfFile || ""}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "typeOfFile", value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Working File</h2>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <input
              type="text"
              //value={workingFileBasePath}
              placeholder="Add Bulk Token Number"
              className="flex-grow rounded-md border border-gray-300 px-4 py-1.5 text-[15px] text-gray-700 focus:outline-none"
            />

            <button
              className="cursor-pointer space-x-1 rounded-md bg-green-500 px-3 py-1.5 text-white hover:bg-green-600"
              //onClick={handleSearch}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
