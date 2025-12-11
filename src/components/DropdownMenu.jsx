import { useState } from "react";
import DynamicModal from "./DynamicModal";
import { logout } from "@/service/apiService";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const DropdownMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Menu>
        <MenuButton className="align-middle outline-none">
          <img
            className="h-8 w-8 cursor-pointer"
            src={`${import.meta.env.BASE_URL}/images/user.png`}
            alt="User Image"
          />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="z-10 w-40 origin-top-right rounded-md border border-gray-200 bg-white p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 data-focus:bg-gray-100">
              <img
                className="h-6 w-6"
                src={`${import.meta.env.BASE_URL}/images/user.png`}
                alt="User Image"
              />
              <span>Admin</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 data-focus:bg-gray-100"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                className="h-6 w-6 mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}/images/signOut.png`}
                alt="Sign Out Image"
              />
              <span>Log Out</span>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      {/* Render the modal only when open */}
      {isModalOpen && (
        <DynamicModal
          title="Are you sure?"
          description="Do you want to logout !!!"
          isModalOpen={() => setIsModalOpen(true)}
          closeModal={closeModal}
          handler={() => {
            logout();
          }}
        />
      )}
    </>
  );
};

export default DropdownMenu;
