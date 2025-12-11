import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error); // Optional: Log for debugging

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-[#1761fd]">Oops!</h1>
      <p className="mb-2 text-xl text-[#32375e]">Something went wrong.</p>
      {error?.status && (
        <p className="mb-2 text-lg text-[#32375e]">Error {error.status}</p>
      )}
      <p className="text-md mb-6 font-semibold text-red-600">
        {error?.statusText || error?.message || "Unknown error"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="cursor-pointer rounded-lg bg-[#1761fd] px-6 py-3 text-white transition duration-300 hover:bg-[#124dca]"
      >
        Reload Page
      </button>
    </div>
  );
}
