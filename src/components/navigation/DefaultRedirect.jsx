import common from "@/common/common";
import staticDataContext from "@/context/staticDataContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const DefaultRedirect = () => {
  const { ClientPAN, crtFy, crtMonth, crtQuarter, typeOfForm } =
    useContext(staticDataContext);

  // Wait until all context values are available
  const isDataReady = crtFy && crtMonth && crtQuarter;

  if (!isDataReady) {
    return null; // Or a loading spinner
  }

  let panelName = "Import Raw Files";
  let pageName = "Deposit";

  const searchObj = {
    pan: ClientPAN,
    fy: crtFy,
    month: crtMonth,
    quarter: crtQuarter,
    typeOfForm:
      pageName === pageName ? (typeOfForm ? typeOfForm[0] : typeOfForm) : null,
    panelName: panelName,
    pageName: pageName,
  };

  const refinedParams = common.getRefinedSearchParams(searchObj);

  // Navigate to Deposit with the computed params
  return <Navigate to={`/home/listSearch/deposit/${refinedParams}`} replace />;
};

export default DefaultRedirect;
