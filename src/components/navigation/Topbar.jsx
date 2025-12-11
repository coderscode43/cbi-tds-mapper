import DropdownMenu from "../DropdownMenu";
import { TooltipWrapper } from "../Tooltip";

const TopBar = ({ isSidebarOpen, setSideBarOpen }) => {
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
                <i
                  className={`fa-solid fa-bars absolute top-0 left-0 cursor-pointer text-gray-400 transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "scale-75 rotate-90 opacity-0"
                      : "scale-100 rotate-0 opacity-100"
                  }`}
                ></i>
                <i
                  className={`fa-solid fa-xmark absolute top-0 left-0 cursor-pointer text-gray-400 transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "scale-100 rotate-0 opacity-100"
                      : "scale-75 -rotate-90 opacity-0"
                  }`}
                ></i>
              </span>
            </button>
            <div>
              <img
                className="h-10 w-auto cursor-pointer object-contain"
                src={`${import.meta.env.BASE_URL}/images/JanaBankLogo_enhanced.png`}
                alt="Jana Bank Logo"
                style={{
                  filter: "contrast(1.1) brightness(1.05)", // Optional enhancement
                }}
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
                className="cursor-pointer rounded-md bg-[#12a4ed] px-2 py-1.5 text-sm text-white"
              >
                Refresh
              </button>
            </TooltipWrapper>
            <DropdownMenu />
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopBar;
