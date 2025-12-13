import { toast } from "sonner";
import UniversalAssets from "./component/UniversalAssets";

const Toast = (message) => {
  // Show a success toast and get the toast ID
  const toastId = toast.success(message, {
    duration: 5000, // auto-dismiss after 5s
    cancel: (
      <UniversalAssets
        asset={"x"}
        size={14}
        className="absolute top-4 right-3 h-5 w-5 cursor-pointer"
        iconHandler={() => toast.dismiss(toastId)}
      />
    ),
  });
};

export default Toast;
