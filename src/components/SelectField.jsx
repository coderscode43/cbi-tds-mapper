import clsx from "clsx";

const SelectField = ({
  label,
  name,
  options,
  value,
  onChange,
  className,
  wrapperClassName,
}) => (
  <div className={clsx("flex w-full flex-col gap-1", wrapperClassName)}>
    <label className="text-md font-medium">{label}</label>
    <select
      name={name}
      id={name}
      className={clsx(
        "custom-scrollbar cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none",
        className
      )}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select {label}</option>
      {options?.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
