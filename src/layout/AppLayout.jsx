import ErrorModal from "@/components/modals/ErrorModal";
import OverrideModal from "@/components/modals/OverrideModal";
import SuccessModal from "@/components/modals/SuccessModal";
import Sidebar from "@/components/navigation/Sidebar";
import TopBar from "@/components/navigation/Topbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <>
      <TopBar setSideBarOpen={setSideBarOpen} isSidebarOpen={sideBarOpen} />
      <Sidebar sideBarOpen={sideBarOpen} />
      <SuccessModal />
      <ErrorModal />
      <OverrideModal />
      <main
        className={`transition-all duration-300 ease-in-out ${sideBarOpen ? "mx-5 my-5 ml-[260px]" : "mx-10 my-5 ml-[104px]"}`}
      >
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
