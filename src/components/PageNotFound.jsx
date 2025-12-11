import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-[#1761fd]">404</h1>
      <p className="mb-2 text-xl text-[#32375e]">Page Not Found</p>
      <p className="text-md mb-6 font-semibold text-[#32375e]">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="cursor-pointer rounded-lg bg-[#1761fd] px-6 py-3 text-white transition duration-300 hover:bg-[#124dca]"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
