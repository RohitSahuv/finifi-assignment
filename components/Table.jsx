import React, { useState } from 'react';
import Spinner from './Spinner';

export const CustomTable = ({ columns, data, onSelectRow, onDeleteRow, isLoading }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRows(checked ? data.map((row) => row.id) : []);
  };

  // Handle individual row selection
  const handleRowSelection = (id, e) => {
    const checked = e.target.checked;
    const updatedSelectedRows = checked
      ? [...selectedRows, id]
      : selectedRows.filter((rowId) => rowId !== id);

    setSelectedRows(updatedSelectedRows);
    if (onSelectRow) {
      onSelectRow(updatedSelectedRows);
    }
  };

  const getBadgeStyle = (status) => {
    const styles = {
      "Awaiting Approval": "px-4 bg-yellow-100 text-yellow-700 border-yellow-500 whitespace-nowrap",
      "Open": "px-4 bg-blue-100 text-blue-700 border-blue-500",
      "Approved": "px-4 bg-green-100 text-green-700 border-green-500",
      "Vendor not found": "bg-red-100 text-red-700 border-red-500",
      "Processing": "px-4 bg-blue-100 text-blue-700 border-blue-500",
      "Paid": "px-4 bg-purple-100 text-purple-700 border-purple-500",
      "default": "px-4 bg-gray-100 text-gray-700 border-gray-500",
    };
    return styles[status] || styles.default;
  };

  // Calculate the data to be displayed on the current page
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  return (
    <div className="w-full">
      <div className="border border-gray-200 rounded-lg w-full overflow-x-auto max-h-96 overflow-y-scroll">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="py-2 px-4 text-center bg-gray-100 text-sm font-medium border-b border-gray-200"
                >
                  {col.key === 'checkbox' ? (
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              <th className="py-2 px-2 text-center bg-gray-100 text-sm font-medium border-b border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>

            {
              isLoading ? <Spinner /> : (
                paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className="py-2 px-4 text-center text-sm border-b border-gray-200"
                        >
                          {col.key === 'checkbox' ? (
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={selectedRows.includes(row.id)}
                              onChange={(e) => handleRowSelection(row.id, e)}
                            />
                          ) : col.key === 'status' ? (
                            <span
                              className={`py-2 px-2 text-xs font-semibold rounded-full border ${getBadgeStyle(
                                row[col.key]
                              )}`}
                            >
                              {row[col.key]}
                            </span>
                          ) : (
                            row[col.key] || '-'
                          )}
                        </td>
                      ))}
                      <td className="flex py-2 px-2 text-sm border-b border-gray-200">
                        <button
                          onClick={() => onSelectRow(row)}
                          className="px-3 py-1 bg-black text-white text-xs font-medium rounded hover:bg-black-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteRow(row)}
                          className="ml-2 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )
            }
          </tbody>
        </table>
      </div>
      {
        paginatedData.length > 0 && (
          <div className="flex justify-end items-center my-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 text-sm font-medium rounded disabled:opacity-50"
            >
              Previous
            </button>
            <div className="mx-2 flex gap-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 text-sm font-medium rounded ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-500 text-white'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 text-sm font-medium rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )
      }
    </div>
  );
};
