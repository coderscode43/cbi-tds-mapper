// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import StaticDataProvider from "./context/StaticDataProvider";
import "./main.css";
import StatusProvider from "./context/StatusProvider.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <StatusProvider>
    <StaticDataProvider>
      <App />
      <Toaster position="top-right" richColors   />
    </StaticDataProvider>
  </StatusProvider>
  // </StrictMode>
);
