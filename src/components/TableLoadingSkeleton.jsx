const TableLoadingSkeleton = ({ columns = 1, rows = 10 }) => {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {[...Array(columns)].map((_, colIndex) => (
            <td
              key={colIndex}
              className="max-w-[70px] min-w-[100px] overflow-hidden border-[1.5px] border-gray-300 p-2"
            >
              <div className="h-4 w-full rounded bg-gray-300" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableLoadingSkeleton;
