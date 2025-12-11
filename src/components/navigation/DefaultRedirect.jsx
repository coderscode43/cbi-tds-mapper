import common from "@/common/common";
import staticDataContext from "@/context/staticDataContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const DefaultRedirect = () => {
  const { ClientPAN, crtFy, crtMonth, crtQuarter, typeOfFile } =
    useContext(staticDataContext);

  // Wait until all context values are available
  const isDataReady = crtFy && crtMonth && crtQuarter;

  if (!isDataReady) {
    return null; // Or a loading spinner
  }

  let panelName = "Import Raw Files";
  let pageName = "Import Deductee";

  const searchObj = {
    pan: ClientPAN,
    fy: crtFy,
    month: crtMonth,
    quarter: crtQuarter,
    typeOfFile:
      pageName === pageName ? (typeOfFile ? typeOfFile[0] : typeOfFile) : null,
    panelName: panelName,
    pageName: pageName,
  };

  const refinedParams = common.getRefinedSearchParams(searchObj);

  // Navigate to importDeductee with the computed params
  return (
    <Navigate to={`/home/listSearch/importDeductee/${refinedParams}`} replace />
  );
};

export default DefaultRedirect;
