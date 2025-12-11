import { useState } from "react";
import StatusContext from "./statusContext";

const StatusProvider = ({ children }) => {
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [overrideModal, setOverrideModal] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState("");
  const [retryAction, setRetryAction] = useState(() => () => {});

  // Show success modal
  const showSuccess = (message, redirectPath = null) => {
    setSuccessMessage(message);
    setRedirectPath(redirectPath);
    setSuccessModal(true);
  };

  // Show error modal
  const showError = (message) => {
    setErrorMessage(message);
    setErrorModal(true);
  };

  /**
   * Show override modal
   * @param {string} message - The message to show
   * @param {(overrideValue: "YES" | "NO") => void} retryFn - Function to retry action with user choice
   */
  const showOverride = (message, retryFn) => {
    setOverrideMessage(message);
    setOverrideModal(true);

    // Wrap retryFn to ensure it's always a function
    if (typeof retryFn === "function") {
      setRetryAction(() => retryFn);
    } else {
      setRetryAction(() => () => {
        console.warn("Retry function is not defined");
      });
    }
  };

  return (
    <StatusContext.Provider
      value={{
        // Success
        successModal,
        setSuccessModal,
        successMessage,
        redirectPath,
        setRedirectPath,

        // Error
        errorModal,
        setErrorModal,
        errorMessage,
        showError,

        // Override
        overrideModal,
        setOverrideModal,
        overrideMessage,
        retryAction,
        showOverride,

        // Success helper
        showSuccess,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
