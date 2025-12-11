const FilterSelect = ({ label, name, options, value, onChange }) => (
  <div className="grid w-90 max-w-md basis-[calc(25%-1rem)] gap-2">
    <label className="text-md font-bold">{label}</label>
    <select
      name={name}
      id={name}
      className="custom-scrollbar block w-full cursor-pointer rounded-[7px] border border-[#0000004d] bg-white px-3 py-2.5 text-sm leading-[1.8] font-normal text-[#303e67] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-[border-color,box-shadow] duration-150 ease-in-out placeholder:text-[#7d8fb3] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      value={value ?? ""} // always scalar
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select {label}</option>
      {options &&
        options?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
    </select>
  </div>
);
export default FilterSelect;
