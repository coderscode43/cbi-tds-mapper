import { LogOut, TriangleAlert, X } from "lucide-react";
import { createPortal } from "react-dom";

const DynamicModal = ({
  title,
  description,
  type,
  isModalOpen,
  closeModal,
  handler,
}) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot || !isModalOpen) return null; // Prevent rendering if not needed
  return createPortal(
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        isModalOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="relative w-full max-w-[23rem] rounded-xl bg-white p-6 shadow-xl transition-all">
        <div className="absolute top-5 right-5 cursor-pointer">
          <X size={22} onClick={() => closeModal()} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {type === "delete" ? (
            <div className="rounded-full bg-amber-100 p-3">
              <TriangleAlert className="text-amber-600" size={22} />
            </div>
          ) : (
            <div className="rounded-full bg-red-100 p-3">
              <LogOut className="text-red-600" size={22} />
            </div>
          )}
          <p className="text-xl font-medium">{title}</p>
        </div>

        <div className="relative pt-1.5 pb-6 text-center text-gray-600">
          <p>{description}</p>
        </div>

        <div className="flex w-full justify-between rounded-b-md">
          <button
            onClick={() => closeModal()}
            className="mx-2 w-full cursor-pointer rounded-lg bg-[#d40008] py-2 font-medium text-white hover:bg-red-500"
          >
            No
          </button>
          <button
            onClick={() => handler()}
            className="mx-2 w-full cursor-pointer rounded-lg bg-green-600 py-2 font-medium text-white hover:bg-green-500"
          >
            Yes
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default DynamicModal;
