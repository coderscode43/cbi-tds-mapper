import { toast } from "sonner";
import { X } from "lucide-react";

const Toast = (message) => {
  // Show a success toast and get the toast ID
  const toastId = toast.success(message, {
    duration: 5000, // auto-dismiss after 5s
    cancel: (
      <X
        size={14}
        className="absolute top-4 right-3 h-5 w-5 cursor-pointer"
        onClick={() => toast.dismiss(toastId)}
      />
    ),
  });
};

export default Toast;
