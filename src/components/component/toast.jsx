import { toast } from "sonner";
import UniversalAssets from "@/components/component/UniversalAssets.jsx";

// Success Toast
const successToast = (message) => {
  const toastSuccess = toast.success(`${message}`, {
    style: { width: "250px", maxWidth: "90%" },
    duration: 2000,
    cancel: (
      <UniversalAssets
        asset={"x"}
        size={14}
        className="absolute top-1 right-1 cursor-pointer text-green-600"
        iconHandler={() => toast.dismiss(toastSuccess)}
      />
    ),
  });
};

// Error Toast
const errorToast = (message) => {
  const toastError = toast.error(`${message}`, {
    style: { width: "250px", maxWidth: "90%" },
    duration: 2000,
    cancel: (
      <UniversalAssets
        asset={"x"}
        size={14}
        className="absolute top-1 right-1 cursor-pointer text-red-600"
        iconHandler={() => toast.dismiss(toastError)}
      />
    ),
  });
};

export { errorToast, successToast };
