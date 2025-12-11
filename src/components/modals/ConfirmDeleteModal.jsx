import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { TriangleAlert, X } from "lucide-react";

const ConfirmDeleteModal = ({ isModalOpen, closeModal, handler }) => {
  useLockBodyScroll(isModalOpen); // Hook is now always called properly

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-92 rounded-xl bg-white p-6 shadow-xl transition-all">
        <div className="absolute top-5 right-5 cursor-pointer">
          <X size={22} onClick={closeModal} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-full bg-amber-100 p-3">
            <TriangleAlert className="text-amber-600" size={22} />
          </div>

          <p className="text-xl font-medium">Are you sure?</p>
        </div>

        <div className="relative pt-1.5 pb-6 text-center text-gray-600">
          <p>Do you really want to delete ?</p>
        </div>

        <div className="flex w-full justify-between rounded-b-md">
          <button
            onClick={closeModal}
            className="mx-2 w-full cursor-pointer rounded-lg bg-[#d40008] py-2 font-medium text-white hover:bg-red-500"
          >
            No
          </button>
          <button
            onClick={handler}
            className="mx-2 w-full cursor-pointer rounded-lg bg-green-600 py-2 font-medium text-white hover:bg-green-500"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
