import UniversalAssets from "../component/UniversalAssets";
import DropdownMenu from "../DropdownMenu";
import {TooltipWrapper} from "../Tooltip";

const TopBar = ({isSidebarOpen, setSideBarOpen}) => {
   return (
      <div className="sticky top-0 z-10">
         <header className="border-b-2 border-gray-300 bg-white">
            <div className="mx-10 flex h-14 items-center justify-between">
               <div className="flex items-center gap-10">
                  <button
                     onClick={() => setSideBarOpen((prev) => !prev)}
                     aria-label="Toggle sidebar"
                  >
              <span className="relative block h-5 w-5">
                <UniversalAssets
                   asset={"menu"}
                   className={`absolute top-0 left-0 cursor-pointer text-gray-400 transition-all duration-300 ease-in-out ${
                      isSidebarOpen
                         ? "scale-75 rotate-90 opacity-0"
                         : "scale-100 rotate-0 opacity-100"
                   }`}
                />
                <UniversalAssets
                   asset={"x"}
                   className={`absolute top-0 left-0 cursor-pointer text-gray-400 transition-all duration-300 ease-in-out ${
                      isSidebarOpen
                         ? "scale-100 rotate-0 opacity-100"
                         : "scale-75 -rotate-90 opacity-0"
                   }`}
                />
              </span>
                  </button>
                  <div>
                     <UniversalAssets
                        asset={`${import.meta.env.BASE_URL}/images/cbi-bank-logo.png`}
                        className="h-10 w-auto cursor-pointer object-contain"
                        alt="CBI Bank Logo"
                     />
                  </div>
               </div>
               <div className="mr-[90px]">
                  <h1 className="text-[var(--primary-color)]` text-2xl font-bold">
                     R J SONI and Associates
                  </h1>
               </div>
               <div className="flex items-center justify-center gap-5">
                  <TooltipWrapper tooltipText={"Refresh"}>
                     <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-sm text-white"
                     >
                        Refresh
                     </button>
                  </TooltipWrapper>
                  <DropdownMenu/>
               </div>
            </div>
         </header>
      </div>
   );
};

export default TopBar;
