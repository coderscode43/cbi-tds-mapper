import common from "@/common/common";
import StickyScrollbarWrapper from "../StickyScrollbarWrapper";
import TableLoadingSkeleton from "@/components/TableLoadingSkeleton";
import UniversalAssets from "../component/UniversalAssets";

const DynamicTableAction = ({
  tableHead,
  tableData,
  setFileListData,
  handleCancel,
  rowLoading = false,
}) => {
  const [lastLocation] = tableData;

  const skeletonRows = 100;

  return (
    <div className="relative w-full">
      <div className="custom-scrollbar max-h-[200px] w-full overflow-y-auto rounded-md border border-gray-200">
        <StickyScrollbarWrapper>
          <table className="w-full text-[14px]">
            <thead
              className="bg-blue-600"
              style={{
                zIndex: 9,
                position: "sticky",
                top: "0px",
              }}
            >
              <tr>
                {tableHead?.map(({ key, label }, index) => (
                  <th
                    key={key || index}
                    className="border-[1.5px] border-gray-300 bg-blue-600 p-2 whitespace-nowrap text-white"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rowLoading ? (
                <TableLoadingSkeleton
                  columns={tableHead.length}
                  rows={skeletonRows}
                />
              ) : !lastLocation ||
                (Object.keys(lastLocation).length === 1 &&
                  Object.keys(lastLocation)[0] === "lastLocation") ? (
                <tr>
                  <td
                    colSpan={tableHead.length}
                    className="p-4 text-center text-[16px] font-semibold text-red-500"
                  >
                    No Files Added
                  </td>
                </tr>
              ) : (
                tableData?.map((data, index) => {
                  //const isChecked = selectedRows.includes(index);

                  return (
                    <tr
                      key={index}
                      className="cursor-pointer bg-white text-center hover:bg-gray-100"
                      onDoubleClick={async () => {
                        const response = await common.getGotoFolder(data);
                        setFileListData(response?.data?.entities || []);
                      }}
                    >
                      {tableHead?.map(({ key, formatter }, colIndex) => (
                        <td
                          key={colIndex}
                          className="w-auto border-[1.5px] border-gray-300 p-2 text-ellipsis whitespace-nowrap"
                        >
                          {key === "action" && data.status === "Pending" ? (
                            // download button Icon shown if the the filetype if filefolder
                            <UniversalAssets
                              asset={"edit"}
                              className="cursor-pointer text-lg text-red-500"
                              iconHandler={() => handleCancel(data)}
                            ></UniversalAssets>
                          ) : formatter ? (
                            formatter(data[key])
                          ) : (
                            (data[key] ?? " ")
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </StickyScrollbarWrapper>
      </div>
    </div>
  );
};

export default DynamicTableAction;
