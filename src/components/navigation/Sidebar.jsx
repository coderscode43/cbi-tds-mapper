import { useContext } from "react";
import common from "@/common/common.js";
import { NavLink, useLocation } from "react-router-dom";
import UniversalAssets from "../component/UniversalAssets";
import staticDataContext from "@/context/staticDataContext.js";

const navItems = [
  {
    id: "deposit",
    label: "Deposit",
    page: "deposit",
    icon: "moneybagPlus",
  },
  {
    id: "withdrawal",
    label: "Withdrawal",
    page: "withdrawal",
    icon: "moneybagMinus",
  },
  {
    id: "others",
    label: "Others",
    page: "others",
    icon: "category",
  },
  {
    id: "settings",
    label: "Settings",
    page: "settings",
    icon: "setting",
  },
];

const Sidebar = ({ sideBarOpen }) => {
  const location = useLocation();
  const { crtFy, crtMonth, crtQuarter, ClientPAN, typeOfForm } =
    useContext(staticDataContext);

  return (
    <div className="fixed top-14 z-10 h-screen">
      <nav
        className={`${sideBarOpen ? "w-60" : "w-16"} group flex h-[91%] flex-col overflow-hidden rounded-r-md border border-l-0 border-gray-300 bg-[#edf2fa] p-2.5 text-gray-600 transition-all duration-300 ease-in-out hover:w-60`}
      >
        <div className="hide-scrollbar flex-1 overflow-y-auto">
          <ul className="space-y-1 text-[15px]">
            {navItems.map(({ id, label, page, icon }) => {
              const searchObj = {
                pan: ClientPAN,
                fy: crtFy,
                month: crtMonth,
                quarter: crtQuarter,
                typeOfForm: typeOfForm,
              };

              const refinedParams = common.getRefinedSearchParams(searchObj);

              const basePath =
                id !== "settings"
                  ? `/home/listSearch/${page}`
                  : `/home/list/${page}`;

              const active = location.pathname.startsWith(basePath);

              return (
                <li key={id}>
                  <NavLink
                    to={
                      id !== "settings"
                        ? `/home/listSearch/${page}/${refinedParams}`
                        : `/home/list/${page}`
                    }
                    className={[
                      "relative flex items-center rounded-md px-2 py-2 transition-all duration-200 ease-out",
                      "group-hover:justify-between",
                      sideBarOpen ? "justify-between" : "justify-center",
                      active
                        ? "bg-blue-100 font-medium text-blue-600"
                        : "hover:bg-white hover:text-blue-600 hover:shadow-sm",
                    ].join(" ")}
                  >
                    {/* LABEL */}
                    <div
                      className={`w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:w-auto group-hover:opacity-100 ${sideBarOpen ? "ml-2 w-auto opacity-100" : ""}`}
                    >
                      {label}
                    </div>

                    {/* ICON */}
                    <UniversalAssets
                      asset={icon}
                      className={active ? "text-blue-600" : "text-gray-600"}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
