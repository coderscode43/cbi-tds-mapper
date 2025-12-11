import common from "@/common/common";
import { useParams } from "react-router-dom";

const Pagination = ({
  entity,
  setListData,
  currentPage,
  setCurrentPage,
  gotoPage,
  setGotoPage,
  totalPages,
}) => {
  const { params } = useParams();

  const handlePagination = async (pageNo) => {
    setGotoPage(pageNo);
    setCurrentPage(pageNo);

    try {
      let response;
      if (params !== undefined) {
        response = await common.getPaginationWithSearch(entity, pageNo, params);
      } else {
        response = await common.getPagination(entity, pageNo);
      }
      setListData(response.data.entities || []);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error while loading next page:", err);
    }
  };

  return (
    <div className="my-5">
      <div className="flex items-center justify-center gap-5">
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-[#024dec] text-white disabled:bg-gray-400"
          disabled={currentPage === 1}
          onClick={() => handlePagination(currentPage - 1)}
        >
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </button>
        <div className="flex items-center justify-center">
          <h5>
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </h5>
        </div>
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-[#024dec] text-white disabled:bg-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => handlePagination(currentPage + 1)}
        >
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <h5>Go to</h5>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={gotoPage}
            onChange={(e) => setGotoPage(Number(e.target.value))}
            className="w-16 rounded-md border border-gray-400 py-0.5 text-center"
          />
          <button
            className="cursor-pointer rounded-md bg-green-700 px-4 py-1 text-white disabled:bg-gray-400 disabled:opacity-50"
            disabled={gotoPage < 1 || gotoPage > totalPages}
            onClick={() => handlePagination(gotoPage)}
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
