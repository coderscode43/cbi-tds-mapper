import statusContext from "@/context/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { useContext } from "react";

const OverrideModal = () => {
  const { overrideModal, setOverrideModal, overrideMessage, retryAction } =
    useContext(statusContext);

  useLockBodyScroll(overrideModal);

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        overrideModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-85 transform rounded-2xl bg-white px-4 pt-6 pb-8 shadow-[inset_10px_10px_14px_3px_#ffffff,inset_-10px_-10px_14px_3px_#ffffff] transition-all duration-300 ease-out`}
      >
        <div>
          {/* Red Check Circle */}

          <div className="mx-auto flex h-15 w-15 items-center justify-center">
            <i className="fa-solid fa-circle-exclamation rounded-full bg-white text-5xl text-amber-500"></i>
          </div>

          {/* Title */}
          <h2 className="mt-4 text-center text-2xl font-medium text-gray-800">
            Warning
          </h2>

          <p className="mt-2 text-center text-gray-500">
            {typeof errorMessage !== "object"
              ? overrideMessage.charAt(0).toUpperCase() +
                overrideMessage.slice(1)
              : overrideMessage}
          </p>
          {/* Footer */}
          <div className="mt-6 flex w-full justify-center gap-3 rounded-b-md">
            <button
              onClick={() => {
                setOverrideModal(false);
              }}
              className="w-2/5 cursor-pointer rounded-lg border-gray-100 bg-gray-200 px-11 py-2 font-medium text-black hover:bg-gray-300"
            >
              No
            </button>

            <button
              onClick={() => {
                setOverrideModal(false);
                retryAction("YES");
              }}
              className="w-2/5 cursor-pointer rounded-lg border border-amber-500 bg-amber-500/90 px-11 py-2 font-medium text-white hover:bg-amber-500"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverrideModal;
