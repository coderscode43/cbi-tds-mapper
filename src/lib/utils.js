import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const errorMessage = (error, fallback = "An error occurred") => {
  return (
    error?.response?.data?.exceptionMsg ||
    error?.response?.data?.message ||
    error?.response?.data?.text() ||
    error?.message ||
    fallback
  );
};

export const anyFileDownload = (response) => {
  // Try to get filename from Content-Disposition
  let fileName = "export.xlsx";
  const cd = response.headers["content-disposition"];
  if (cd) {
    const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i);
    if (match) fileName = decodeURIComponent(match[1] || match[2]);
  }

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName); // use filename as passed in
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const fileSize = (value) => (value === 0 ? null : `${value}`);

// DD-MM-YYYY HH:MM:SS -> 11-10-2025 14:45:30
export const dateWithTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const refinedSearchParams = (searchParams) => {
  const refinedSearchParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => {
          // Trim whitespace if value is a string
          if (typeof value === "string") {
            value = value.trim();
          }
          return [key, value];
        })
        .filter(
          (entry) =>
            entry[1] !== "" && entry[1] !== null && entry[1] !== undefined
        )
        .map(([key, value]) => {
          // If value matches YYYY-MM-DD format, convert to ISO string
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return [key, new Date(value).toISOString()];
          }
          return [key, value];
        })
    );

  return JSON.stringify(refinedSearchParams(searchParams));
};

export const parsedParams = (params) => JSON.parse(params);
